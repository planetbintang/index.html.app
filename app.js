const $ = id => document.getElementById(id);
const state = {
  views: Number(sessionStorage.getItem('all_views') || 0),
  readerDocument: null,
  readerOffset: 0,
  actualNzFiles: 0
};
const READER_PAGE_SIZE = 100;
const sampleFiles = [
  ['Spesifikasi sistem Ilmu+', 'Metadata target dan status Ilmu+', 'AL.L/ilmu+/sistem-data-utama.nz'],
  ['Pointer sistem pelaporan', 'Berkas pointer; target lama tidak dimuat', 'AL.L/sistem-pelaporan-alur/modul-analisis-arsip-aman.nz'],
  ['Konfigurasi storage Biologi', 'Kode konfigurasi .nz', '.io/konfigurasi-biologi.nz']
];

function updateClock() {
  $('clock').textContent = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function updateMetrics() {
  $('viewCount').textContent = state.views.toLocaleString('id-ID');
  $('actualNzFiles').textContent = state.actualNzFiles.toLocaleString('id-ID');
}

function renderFiles(files) {
  const box = $('storyGrid');
  box.replaceChildren();
  if (!files.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Tidak ada path `.nz` yang cocok. Coba nama file atau direktori lain.';
    box.appendChild(empty);
    return;
  }
  for (const file of files) {
    const card = document.createElement('article');
    card.className = 'story';
    const visual = document.createElement('div');
    visual.className = 'story-visual';
    visual.setAttribute('aria-hidden', 'true');
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = 'FILE .NZ · NAMA BERKAS';
    const title = document.createElement('h3');
    title.textContent = file.title;
    const body = document.createElement('p');
    body.className = 'file-path-caption';
    body.textContent = file.path;
    const note = document.createElement('small');
    note.className = 'file-integrity-note';
    note.textContent = 'Nama berkas bukan judul editorial; isi akan dibaca langsung dari file.';
    const open = document.createElement('button');
    open.className = 'read';
    open.type = 'button';
    open.textContent = 'Buka file .nz →';
    open.addEventListener('click', () => openNZFile(file.path));
    card.append(visual, tag, title, body, note, open);
    box.appendChild(card);
  }
}

function drawExamples() {
  const box = $('indexGrid');
  box.replaceChildren();
  for (const [titleText, description, path] of sampleFiles) {
    const button = document.createElement('button');
    button.className = 'index-item';
    button.type = 'button';
    const title = document.createElement('b');
    title.textContent = titleText;
    const small = document.createElement('small');
    small.textContent = `${description} · ${path}`;
    button.append(title, small);
    button.addEventListener('click', () => {
      $('nzFilePath').value = path;
      openNZFile(path);
    });
    box.appendChild(button);
  }
}

async function searchFiles(query = '') {
  const normalized = String(query || '').trim();
  $('footerStatus').textContent = 'mencari path .nz…';
  $('resultNote').textContent = 'Menelusuri katalog .nz…';
  try {
    const result = await NZFS.searchFiles(normalized, 24, progress => {
      $('resultNote').textContent = `Menelusuri ${progress.scanned.toLocaleString('id-ID')} dari ${progress.total.toLocaleString('id-ID')} path…`;
    });
    state.actualNzFiles = result.total;
    renderFiles(result.items);
    const queryText = normalized ? `Path cocok untuk “${normalized}”: ` : 'File AL.L pertama: ';
    $('resultNote').textContent = `${queryText}${result.items.length}${result.truncated ? ' (hasil dibatasi; persempit pencarian)' : ''}`;
    $('fileStatus').textContent = `${result.total.toLocaleString('id-ID')} file .nz tersedia di katalog; angka file bukan jumlah judul unik atau terverifikasi.`;
    $('footerStatus').textContent = 'katalog path .nz siap';
    updateMetrics();
    if (normalized) $('bacaan').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    $('resultNote').textContent = 'Katalog file .nz belum dapat dibaca';
    $('footerStatus').textContent = error.message;
    $('fileStatus').textContent = error.message;
    renderFiles([]);
  }
}

function makeStatus(documentData) {
  if (documentData.type === 'article') {
    const integrity = documentData.integrity || {};
    return `File artikel .nz; label file: ${documentData.editorialLabel}. ${integrity.missingTitles || 0} judul, ${integrity.missingBodies || 0} isi, ${integrity.missingSources || 0} sitasi belum lengkap. Parser tidak memverifikasi kebenaran sumber.`;
  }
  if (documentData.type === 'pointer') {
    return `File ini adalah pointer .nz. Metadata ditampilkan apa adanya; target ${documentData.targetPath || 'tidak tercatat'} tidak diambil atau ditampilkan.`;
  }
  if (documentData.type === 'legacy-text') {
    return 'Teks disimpan di file .nz dan ditampilkan apa adanya. Judul editorial serta sitasi tidak disimpulkan otomatis.';
  }
  return 'Metadata/teks dibaca langsung dari file .nz; ini bukan klaim artikel ilmiah terverifikasi.';
}

function renderReaderPage() {
  const documentData = state.readerDocument;
  const box = $('reading');
  box.replaceChildren();
  if (!documentData) return;
  const points = documentData.points || [];
  const end = Math.min(state.readerOffset + READER_PAGE_SIZE, points.length);
  for (const point of points.slice(state.readerOffset, end)) {
    const row = document.createElement('section');
    row.className = 'point';
    const number = document.createElement('b');
    number.textContent = String(point.number || '').padStart(3, '0');
    const content = document.createElement('div');
    const heading = document.createElement('h3');
    heading.className = 'point-heading';
    heading.textContent = point.title || `Judul tidak tersedia pada sumber · Poin ${point.number || ''}`;
    content.appendChild(heading);
    for (const paragraph of String(point.body || '').split(/\n\s*\n/).filter(Boolean)) {
      const p = document.createElement('p');
      p.className = 'point-body';
      p.textContent = paragraph;
      content.appendChild(p);
    }
    for (const citation of point.sources || []) {
      const source = document.createElement('p');
      source.className = 'point-source';
      source.textContent = `Sumber tercatat di file: ${citation}`;
      content.appendChild(source);
    }
    row.append(number, content);
    box.appendChild(row);
  }
  if (!points.length && documentData.raw) {
    const raw = document.createElement('pre');
    raw.className = 'nz-raw';
    raw.textContent = documentData.raw;
    box.appendChild(raw);
  }
  state.readerOffset = end;
  $('loadMorePoints').hidden = end >= points.length || !points.length;
  $('loadMorePoints').textContent = `Muat 100 poin berikutnya (${end.toLocaleString('id-ID')}/${points.length.toLocaleString('id-ID')})`;
  $('readerPointCount').textContent = `${points.length.toLocaleString('id-ID')} poin dalam file`;
  $('readerRange').textContent = points.length ? `1—${points.length.toLocaleString('id-ID')}` : 'metadata';
}

function openDocument(documentData) {
  state.readerDocument = documentData;
  state.readerOffset = 0;
  state.views += 1;
  sessionStorage.setItem('all_views', String(state.views));
  updateMetrics();
  $('readerCategory').textContent = documentData.category || documentData.type;
  $('readerTitle').textContent = documentData.title || documentData.path;
  $('readerDeck').textContent = documentData.abstract || `Isi file ${documentData.path} ditampilkan sesuai data yang tersimpan.`;
  $('readerMeta').textContent = documentData.path;
  $('readerStatus').textContent = makeStatus(documentData);
  $('readerIntegrity').textContent = makeStatus(documentData);
  const source = $('readerSource');
  source.textContent = `Buka file sumber: ${documentData.path}`;
  source.href = NZFS.url(documentData.path);
  source.title = documentData.path;
  $('readerCorpusSource').textContent = documentData.targetPath ? `Target pointer (tidak dimuat): ${documentData.targetPath}` : '';
  renderReaderPage();
  $('reader').hidden = false;
  document.querySelectorAll('main>section:not(#reader):not(#accountPanel)').forEach(section => { section.hidden = true; });
  setActiveNavigation('#bacaan');
  $('reader').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function openNZFile(path) {
  const normalized = String(path || '').trim();
  if (!normalized) return;
  $('fileStatus').textContent = `Membuka ${normalized}…`;
  try {
    const documentData = await NZFS.read(normalized);
    $('fileStatus').textContent = `${documentData.path} dibuka langsung · tipe ${documentData.type}.`;
    openDocument(documentData);
  } catch (error) {
    $('fileStatus').textContent = error.message;
    $('footerStatus').textContent = error.message;
  }
}

function restoreHome() {
  $('reader').hidden = true;
  document.querySelectorAll('main>section:not(#reader):not(#accountPanel)').forEach(section => { section.hidden = false; });
  state.readerDocument = null;
}

function closeReader() {
  restoreHome();
  $('bacaan').scrollIntoView({ behavior: 'smooth', block: 'start' });
  const url = new URL(location.href);
  url.searchParams.delete('nz');
  url.hash = 'bacaan';
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  setActiveNavigation('#bacaan');
}

const nav = $('mainNav');
const menuButton = $('menuButton');
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
function setActiveNavigation(hash) {
  const targetHash = hash || '#top';
  for (const link of navLinks) {
    const active = link.getAttribute('href') === targetHash;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
function closeMenu() {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Buka navigasi');
}
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('open', expanded);
  menuButton.setAttribute('aria-expanded', String(expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Tutup navigasi' : 'Buka navigasi');
});
nav.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  if (!$('reader').hidden) restoreHome();
  setActiveNavigation(link.getAttribute('href'));
  closeMenu();
});
document.addEventListener('click', event => {
  if (nav.classList.contains('open') && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.addEventListener('hashchange', () => setActiveNavigation(location.hash));
let navTick = false;
window.addEventListener('scroll', () => {
  if (navTick) return;
  navTick = true;
  requestAnimationFrame(() => {
    navTick = false;
    if (!$('reader').hidden) return;
    let active = '#top';
    const candidates = navLinks.map(link => {
      const section = document.querySelector(link.getAttribute('href'));
      return section && !section.hidden ? { hash: link.getAttribute('href'), top: section.getBoundingClientRect().top } : null;
    }).filter(item => item && item.top <= 130).sort((a, b) => b.top - a.top);
    if (candidates.length) active = candidates[0].hash;
    setActiveNavigation(active);
  });
}, { passive: true });

$('searchForm').addEventListener('submit', event => {
  event.preventDefault();
  searchFiles($('searchInput').value);
});
document.querySelectorAll('[data-query]').forEach(button => button.addEventListener('click', () => {
  $('searchInput').value = button.dataset.query;
  searchFiles(button.dataset.query);
}));
$('nzFileForm').addEventListener('submit', event => {
  event.preventDefault();
  openNZFile($('nzFilePath').value);
});
document.querySelectorAll('[data-nzpath]').forEach(button => button.addEventListener('click', () => {
  $('nzFilePath').value = button.dataset.nzpath;
  openNZFile(button.dataset.nzpath);
}));
$('closeReader').addEventListener('click', closeReader);
$('loadMorePoints').addEventListener('click', renderReaderPage);
$('shareButton').addEventListener('click', async () => {
  try {
    const url = new URL(location.href);
    if (state.readerDocument?.path) url.searchParams.set('nz', state.readerDocument.path);
    url.hash = 'reader';
    await navigator.clipboard.writeText(url.href);
    $('footerStatus').textContent = 'tautan file disalin';
  } catch {
    $('footerStatus').textContent = 'gunakan URL file sumber untuk berbagi';
  }
});

async function start() {
  drawExamples();
  updateClock();
  updateMetrics();
  setInterval(updateClock, 1000);
  setActiveNavigation(location.hash || '#top');
  try {
    const summary = await NZFS.readSummary();
    state.actualNzFiles = summary.catalog_nz_file_count;
    updateMetrics();
  } catch (error) {
    $('fileStatus').textContent = error.message;
  }
  const requestedFile = new URLSearchParams(location.search).get('nz');
  if (requestedFile) openNZFile(requestedFile);
  else searchFiles('');
}
start();
