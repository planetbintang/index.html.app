/* Filesystem virtual .nz baca-saja untuk GitHub Pages; katalog berisi path file, isi dibaca on-demand. */
(() => {
  'use strict';

  const scriptUrl = document.currentScript?.src || document.baseURI;
  const repoRoot = new URL('./', scriptUrl);
  const textCache = new Map();
  const summaryCache = { promise: null };
  const legacyCorpusPath = 'nz/korpus-ilmu-pengetahuan-10000.nz';
  const catalogPath = 'datanz/nz-catalog.txt.gz';
  const summaryPath = 'datanz/nz-catalog-summary.json';

  function normalizePath(input) {
    let value = String(input || '').trim().replace(/\\/g, '/');
    value = value.replace(/^(?:\.\/)+/, '');
    const parts = value.split('/');
    if (!value || value.startsWith('/') || /[?#]/.test(value) || value.includes('://') || parts.some(part => !part || part === '.' || part === '..')) {
      throw new Error('Path harus relatif terhadap repository dan tidak boleh keluar dari root.');
    }
    if (!value.toLowerCase().endsWith('.nz')) throw new Error('Filesystem ini hanya membuka file .nz.');
    return value;
  }

  function urlForPath(path) {
    const safePath = normalizePath(path);
    const encoded = safePath.split('/').map(encodeURIComponent).join('/');
    const url = new URL(encoded, repoRoot);
    if (url.origin !== repoRoot.origin || !url.pathname.startsWith(repoRoot.pathname)) {
      throw new Error('Path berada di luar root repository.');
    }
    return url;
  }

  async function fetchText(path) {
    const safePath = normalizePath(path);
    if (textCache.has(safePath)) return textCache.get(safePath);
    const pending = (async () => {
      if (safePath === legacyCorpusPath) throw new Error('Korpus lama telah dilepas dari beranda; buka file .nz sumber lain.');
      const response = await fetch(urlForPath(safePath), { cache: 'force-cache' });
      if (!response.ok) throw new Error(`Berkas ${safePath} tidak tersedia (HTTP ${response.status}).`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      let text;
      if (bytes.length > 1 && bytes[0] === 0x1f && bytes[1] === 0x8b) {
        if (typeof DecompressionStream === 'undefined') throw new Error('Browser ini belum mendukung pembacaan gzip; gunakan browser modern.');
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
        text = await new Response(stream).text();
      } else {
        text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
      }
      return text.replace(/^\uFEFF/, '');
    })();
    textCache.set(safePath, pending);
    try {
      return await pending;
    } catch (error) {
      textCache.delete(safePath);
      throw error;
    }
  }

  async function readSummary() {
    if (!summaryCache.promise) {
      summaryCache.promise = fetch(new URL(summaryPath, repoRoot), { cache: 'force-cache' })
        .then(response => {
          if (!response.ok) throw new Error(`Ringkasan katalog tidak tersedia (HTTP ${response.status}).`);
          return response.json();
        });
    }
    return summaryCache.promise;
  }

  async function* catalogLines() {
    const response = await fetch(new URL(catalogPath, repoRoot), { cache: 'force-cache' });
    if (!response.ok) throw new Error(`Katalog file .nz tidak tersedia (HTTP ${response.status}).`);
    if (!response.body) throw new Error('Browser tidak menyediakan aliran baca untuk katalog.');
    const sourceReader = response.body.getReader();
    const firstChunks = [];
    let firstLength = 0;
    let sourceEnded = false;
    while (firstLength < 2 && !sourceEnded) {
      const item = await sourceReader.read();
      if (item.done) { sourceEnded = true; break; }
      firstChunks.push(item.value);
      firstLength += item.value.length;
    }
    let firstPending = null;
    if (firstLength) {
      firstPending = new Uint8Array(firstLength);
      let offset = 0;
      for (const chunk of firstChunks) { firstPending.set(chunk, offset); offset += chunk.length; }
    }
    const startsGzip = !!firstPending && firstPending.length > 1 && firstPending[0] === 0x1f && firstPending[1] === 0x8b;
    let byteStream = new ReadableStream({
      async pull(controller) {
        if (firstPending) {
          controller.enqueue(firstPending);
          firstPending = null;
          return;
        }
        const item = await sourceReader.read();
        if (item.done) controller.close();
        else controller.enqueue(item.value);
      },
      cancel(reason) { return sourceReader.cancel(reason); }
    });
    if (startsGzip) {
      if (typeof DecompressionStream === 'undefined') throw new Error('Browser ini belum mendukung pencarian katalog gzip.');
      byteStream = byteStream.pipeThrough(new DecompressionStream('gzip'));
    }
    const textReader = byteStream.pipeThrough(new TextDecoderStream()).getReader();
    let buffer = '';
    let completed = false;
    try {
      while (true) {
        const { value, done } = await textReader.read();
        if (done) { completed = true; break; }
        buffer += value;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) if (line) yield line.replace(/\r$/, '');
      }
      if (buffer) yield buffer.replace(/\r$/, '');
    } finally {
      if (!completed) await textReader.cancel().catch(() => {});
      textReader.releaseLock();
    }
  }

  async function searchFiles(query = '', limit = 24, onProgress = () => {}) {
    const summary = await readSummary();
    const q = String(query || '').trim().toLocaleLowerCase('id-ID');
    const items = [];
    let scanned = 0;
    let truncated = false;
    for await (const path of catalogLines()) {
      scanned += 1;
      const matches = q ? path.toLocaleLowerCase('id-ID').includes(q) : path.startsWith('AL.L/');
      if (matches) {
        items.push({ path, title: path.split('/').pop().replace(/\.nz$/i, '').replace(/[-_]+/g, ' ') });
        if (items.length >= limit) {
          truncated = true;
          break;
        }
      }
      if (scanned % 50000 === 0) {
        onProgress({ scanned, total: summary.catalog_file_count });
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    return { items, total: summary.catalog_file_count, scanned, truncated, query: q };
  }

  function keyValues(text) {
    const out = {};
    for (const line of text.split(/\r?\n/)) {
      const match = /^\s*([a-zA-Z0-9_.-]+)\s*=\s*(.*?)\s*$/.exec(line);
      if (match) {
        const key = match[1].toLowerCase();
        if (key === 'source') (out.sources ||= []).push(match[2]);
        else out[key] = match[2];
      }
    }
    return out;
  }

  function parseLegacyPoints(text) {
    const points = [];
    for (const line of text.split(/\r?\n/)) {
      const match = /^\s*Poin\s+(\d+)\s*:\s*(.*)\s*$/i.exec(line);
      if (match) points.push({ number: Number(match[1]), title: null, body: match[2], raw: line.trim(), sources: [] });
    }
    return points;
  }

  function parseArticle(text, path) {
    const lines = text.split(/\r?\n/);
    if ((lines[0] || '').trim() !== '# NZ-ARTICLE/1') return null;
    const metadata = { sources: [] };
    const points = [];
    let current = null;
    for (const line of lines.slice(1)) {
      const heading = /^##\s*Poin\s+(\d+)\s*\|\s*(.+?)\s*$/.exec(line);
      if (heading) {
        current = { number: Number(heading[1]), title: heading[2], bodyLines: [], sources: [] };
        points.push(current);
        continue;
      }
      const source = /^source\s*=\s*(.+?)\s*$/i.exec(line);
      if (source) {
        (current ? current.sources : metadata.sources).push(source[1]);
        continue;
      }
      if (!current) {
        const field = /^([a-zA-Z0-9_.-]+)\s*=\s*(.*?)\s*$/.exec(line);
        if (field) metadata[field[1].toLowerCase()] = field[2];
      } else current.bodyLines.push(line);
    }
    const normalizedPoints = points.map(point => ({
      number: point.number, title: point.title, body: point.bodyLines.join('\n').trim(),
      sources: point.sources.length ? point.sources : metadata.sources.slice()
    }));
    return {
      type: 'article', path, title: metadata.title || path.split('/').pop().replace(/\.nz$/i, ''),
      category: metadata.category || '', abstract: metadata.abstract || '', editorialLabel: metadata.status || 'draft',
      points: normalizedPoints,
      integrity: {
        missingTitles: normalizedPoints.filter(point => !point.title).length,
        missingBodies: normalizedPoints.filter(point => !point.body).length,
        missingSources: normalizedPoints.filter(point => !point.sources.length).length,
        parserVerified: false
      }, metadata
    };
  }

  function parseJsonlPoints(text, path) {
    const rows = text.split(/\r?\n/);
    if (rows.at(-1) === '') rows.pop();
    if (!rows.length) return null;
    let first;
    try { first = JSON.parse(rows[0]); }
    catch { return null; }
    if (first?.format !== 'NZ-POINTS/1') return null;
    const points = [];
    for (let i = 0; i < rows.length; i += 1) {
      const line = rows[i];
      if (!line.trim()) throw new Error(`Format NZ-POINTS/1: baris ${i + 1} kosong; satu baris harus berisi satu poin.`);
      let item;
      try { item = JSON.parse(line); }
      catch { throw new Error(`Format NZ-POINTS/1: JSON pada baris ${i + 1} tidak valid.`); }
      if (item?.format !== 'NZ-POINTS/1') throw new Error(`Format NZ-POINTS/1 harus konsisten pada baris ${i + 1}.`);
      const number = Number(item.nomor);
      if (!Number.isSafeInteger(number) || number !== i + 1) {
        throw new Error(`Format NZ-POINTS/1: nomor poin pada baris ${i + 1} harus berurutan (${i + 1}).`);
      }
      const title = typeof item.judul === 'string' ? item.judul.trim() : '';
      const body = typeof item.isi === 'string' ? item.isi.trim() : '';
      if (!title || !body) throw new Error(`Format NZ-POINTS/1: poin ${number} wajib memiliki judul dan isi.`);
      const category = typeof item.bidang === 'string' ? item.bidang.trim() : '';
      if (!category) throw new Error(`Format NZ-POINTS/1: poin ${number} wajib mencantumkan bidang ilmu.`);
      const sources = Array.isArray(item.sumber)
        ? item.sumber.filter(source => typeof source === 'string' && source.trim()).map(source => source.trim())
        : typeof item.sumber === 'string' && item.sumber.trim() ? [item.sumber.trim()] : [];
      if (!sources.length) throw new Error(`Format NZ-POINTS/1: poin ${number} wajib mencantumkan sumber.`);
      points.push({ number, title, body, sources, category });
    }
    if (!points.length) throw new Error('Format NZ-POINTS/1 harus berisi poin setelah baris format.');
    return {
      type: 'article', format: 'NZ-POINTS/1', path,
      title: path.split('/').pop().replace(/\.nz$/i, '').replace(/[-_]+/g, ' '),
      category: points.find(point => point.category)?.category || '',
      abstract: 'Isi poin dibaca baris demi baris langsung dari file .nz.',
      editorialLabel: 'draf · sumber tercantum, belum diverifikasi', points,
      integrity: {
        missingTitles: 0, missingBodies: 0, missingSources: 0,
        expectedPointCount: 10000, pointCountMatches: points.length === 10000,
        parserVerified: false
      }, metadata: {}
    };
  }

  async function read(path) {
    const safePath = normalizePath(path);
    if (safePath === legacyCorpusPath) throw new Error('Korpus lama tidak ditampilkan. Pilih file .nz dari katalog.');
    const text = await fetchText(safePath);
    const firstLine = (text.split(/\r?\n/, 1)[0] || '').trim();
    if (/^#\s*Pointer mesin nz$/i.test(firstLine)) {
      const metadata = keyValues(text);
      let targetPath = null;
      if (metadata.corpus) targetPath = normalizePath(metadata.corpus);
      return {
        type: 'pointer', path: safePath, title: metadata.title || safePath.split('/').pop().replace(/\.nz$/i, ''),
        metadata, targetPath, raw: text, points: [], integrity: { parserVerified: false }
      };
    }
    const jsonlPoints = parseJsonlPoints(text, safePath);
    if (jsonlPoints) return jsonlPoints;
    const article = parseArticle(text, safePath);
    if (article) return article;
    const points = parseLegacyPoints(text);
    if (points.length) {
      return {
        type: 'legacy-text', path: safePath, title: safePath.split('/').pop().replace(/\.nz$/i, ''),
        raw: text, points, integrity: { parserVerified: false }
      };
    }
    const metadata = keyValues(text);
    return {
      type: Object.keys(metadata).length ? 'metadata' : 'text', path: safePath,
      title: metadata.title || firstLine.replace(/^#\s*/, '') || safePath.split('/').pop(), raw: text, metadata,
      points: [], integrity: { parserVerified: false }
    };
  }

  function url(path) { return urlForPath(path).href; }

  globalThis.NZFS = Object.freeze({ normalizePath, read, readSummary, searchFiles, url });
  if (typeof module !== 'undefined' && module.exports) module.exports = globalThis.NZFS;
})();
