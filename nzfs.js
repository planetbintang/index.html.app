/* Filesystem virtual .nz baca-saja untuk GitHub Pages. */
(() => {
  'use strict';

  const scriptUrl = document.currentScript?.src || document.baseURI;
  const repoRoot = new URL('./', scriptUrl);
  const textCache = new Map();
  const corpusPath = 'nz/korpus-ilmu-pengetahuan-10000.nz';

  function normalizePath(input) {
    let value = String(input || '').trim().replace(/\\/g, '/');
    value = value.replace(/^(?:\.\/)+/, '');
    const parts = value.split('/');
    if (!value || value.startsWith('/') || /[?#]/.test(value) || parts.some(part => !part || part === '.' || part === '..')) {
      throw new Error('Path harus relatif terhadap repository dan tidak boleh keluar dari root.');
    }
    if (!value.toLowerCase().endsWith('.nz')) throw new Error('Filesystem ini hanya membuka file .nz.');
    return value;
  }

  function fileUrl(path) {
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
      const response = await fetch(fileUrl(safePath), { cache: 'force-cache' });
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
      if (!match) continue;
      points.push({ number: Number(match[1]), title: null, body: match[2], raw: line.trim(), sources: [] });
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
      } else {
        current.bodyLines.push(line);
      }
    }
    const normalizedPoints = points.map(point => ({
      number: point.number,
      title: point.title,
      body: point.bodyLines.join('\n').trim(),
      sources: point.sources.length ? point.sources : metadata.sources.slice()
    }));
    const missingTitles = normalizedPoints.filter(point => !point.title).length;
    const missingBodies = normalizedPoints.filter(point => !point.body).length;
    const missingSources = normalizedPoints.filter(point => !point.sources.length).length;
    return {
      type: 'article', path, title: metadata.title || path.split('/').pop().replace(/\.nz$/i, ''),
      category: metadata.category || '', abstract: metadata.abstract || '',
      editorialLabel: metadata.status || 'draft', points: normalizedPoints,
      integrity: { missingTitles, missingBodies, missingSources, parserVerified: false }, metadata
    };
  }

  function rangeFromPointer(value, total) {
    const match = /^(\d+)\s*-\s*(\d+)$/.exec(String(value || '').trim());
    if (!match) throw new Error('rentang_poin harus berbentuk angka-awal-angka-akhir, misalnya 1-10.');
    const start = Number(match[1]);
    const end = Number(match[2]);
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 1 || end < start || end > total) {
      throw new Error('Rentang poin tidak valid atau melewati jumlah poin sumber.');
    }
    return { start, end };
  }

  async function read(path) {
    const safePath = normalizePath(path);
    const text = await fetchText(safePath);
    const firstLine = (text.split(/\r?\n/, 1)[0] || '').trim();

    if (/^#\s*Pointer mesin nz$/i.test(firstLine)) {
      const metadata = keyValues(text);
      const sourcePath = normalizePath(metadata.corpus || '');
      const corpusText = await fetchText(sourcePath);
      const corpusPoints = parseLegacyPoints(corpusText);
      if (!corpusPoints.length) throw new Error(`Korpus ${sourcePath} tidak berisi baris "Poin N:" yang dikenali.`);
      const declaredTotal = Number(metadata.jumlah_poin || corpusPoints.length);
      if (!Number.isSafeInteger(declaredTotal) || declaredTotal !== corpusPoints.length) {
        throw new Error(`Jumlah poin pada pointer (${metadata.jumlah_poin}) tidak cocok dengan korpus (${corpusPoints.length}).`);
      }
      const range = rangeFromPointer(metadata.rentang_poin, declaredTotal);
      const points = corpusPoints.filter(point => point.number >= range.start && point.number <= range.end);
      if (points.length !== range.end - range.start + 1) throw new Error('Baris korpus tidak lengkap untuk rentang pointer yang diminta.');
      return {
        type: 'pointer', path: safePath, sourcePath, title: metadata.title || safePath.split('/').pop().replace(/\.nz$/i, ''),
        category: metadata.category || '', metadata, range, totalPoints: declaredTotal, points,
        integrity: { missingTitles: points.length, missingBodies: 0, missingSources: points.length, parserVerified: false }
      };
    }

    const article = parseArticle(text, safePath);
    if (article) return article;

    const points = parseLegacyPoints(text);
    if (points.length) {
      return {
        type: 'legacy-corpus', path: safePath, title: safePath.split('/').pop().replace(/\.nz$/i, ''),
        points, totalPoints: points.length,
        integrity: { missingTitles: points.length, missingBodies: 0, missingSources: points.length, parserVerified: false }
      };
    }

    const metadata = keyValues(text);
    return {
      type: Object.keys(metadata).length ? 'metadata' : 'text', path: safePath,
      title: metadata.title || firstLine.replace(/^#\s*/, '') || safePath.split('/').pop(),
      raw: text, metadata, points: [], integrity: { parserVerified: false }
    };
  }

  async function searchCorpus(query = '', limit = 24) {
    const document = await read(corpusPath);
    const q = String(query || '').trim().toLocaleLowerCase('id-ID');
    const matches = q
      ? document.points.filter(point => `${point.number} ${point.raw}`.toLocaleLowerCase('id-ID').includes(q))
      : document.points;
    return { path: corpusPath, total: document.points.length, matched: matches.length, items: matches.slice(0, limit) };
  }

  function url(path) {
    return fileUrl(path).href;
  }

  globalThis.NZFS = Object.freeze({ normalizePath, read, searchCorpus, url, corpusPath });
  if (typeof module !== 'undefined' && module.exports) module.exports = globalThis.NZFS;
})();
