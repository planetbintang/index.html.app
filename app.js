const bidang = [
  ['Fisika', 'Alam dan materi'], ['Kimia', 'Zat dan perubahan'], ['Biologi', 'Kehidupan dan sel'],
  ['Matematika', 'Pola dan angka'], ['Astronomi', 'Ruang dan semesta'], ['Geografi', 'Bumi dan wilayah'],
  ['Sejarah', 'Waktu dan peradaban'], ['Bahasa', 'Makna dan komunikasi'], ['Kesehatan', 'Tubuh dan kesejahteraan'],
  ['Teknologi', 'Alat dan sistem'], ['Ekonomi', 'Sumber daya dan pilihan'], ['Hukum', 'Aturan dan keadilan'],
  ['Etika', 'Nilai dan tanggung jawab'], ['Sosiologi', 'Masyarakat dan relasi'], ['Lingkungan', 'Bumi dan keberlanjutan'],
  ['Energi', 'Daya dan perubahan'], ['Pendidikan', 'Belajar dan tumbuh'], ['Seni', 'Bentuk dan ekspresi'],
  ['Pangan', 'Gizi dan kehidupan'], ['Komunikasi', 'Pesan dan hubungan']
];
const $ = id => document.getElementById(id);
const state = { views: Number(sessionStorage.getItem('all_views') || 0), readerDocument: null, readerOffset: 0, corpusCount: 0 };
const READER_PAGE_SIZE = 100;

function updateClock() {
  $('clock').textContent = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function updateMetrics() {
  $('viewCount').textContent = state.views.toLocaleString('id-ID');
  $('corpusCount').textContent = state.corpusCount.toLocaleString('id-ID');
  $('indexedCount').textContent = state.corpusCount.toLocaleString('id-ID');
}

function renderStories(points) {
  const box = $('storyGrid');
  box.replaceChildren();
  if (!points.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Tidak ada baris sumber yang cocok dengan pencarian ini.';
    box.appendChild(empty);
    return;
  }
  for (const point of points) {
    const card = document.createElement('article');
    card.className = 'story';
    const visual = document.createElement('div');
    visual.className = 'story-visual';
    visual.setAttribute('aria-hidden', 'true');
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = `NZ · POIN ${point.number}`;
    const title = document.createElement('h3');
    title.textContent = `Poin ${point.number} — judul terpisah tidak tersedia`;
    const body = document.createElement('p');
    body.textContent = point.body;
    const read = document.createElement('button');
    read.className = 'read';
    read.type = 'button';
    read.textContent = 'Baca baris sumber →';
    read.addEventListener('click', () => openPoint(point));
    card.append(visual, tag, title, body, read);
    box.appendChild(card);
  }
}

function drawIndex() {
  const box = $('indexGrid');
  box.replaceChildren();
  bidang.forEach(([name, description]) => {
    const button = document.createElement('button');
    button.className = 'index-item';
    button.type = 'button';
    const title = document.createElement('b');
    title.textContent = name;
    const subtitle = document.createElement('small');
    subtitle.textContent = `${description} · cari pada teks sumber`;
    button.append(title, subtitle);
    button.addEventListener('click', () => {
      $('searchInput').value = name.toLocaleLowerCase('id-ID');
      searchCorpus(name);
    });
    box.appendChild(button);
  });
}

function setSearchStatus(query, result) {
  const label = query ? `“${query}” · ${result.matched.toLocaleString('id-ID')} kecocokan` : `${result.total.toLocaleString('id-ID')} baris sumber`;
  $('resultNote').textContent = `${label} · menampilkan ${result.items.length}`;
}

async function searchCorpus(query = '') {
  const normalized = String(query || '').trim();
  $('footerStatus').textContent = 'mencari pada korpus .nz…';
  $('resultNote').textContent = 'Membaca sumber .nz…';
  try {
    const result = await NZFS.searchCorpus(normalized, 24);
    state.corpusCount = result.total;
    renderStories(result.items);
    setSearchStatus(normalized, result);
    $('fileStatus').textContent = `Korpus sumber tersedia: ${result.total.toLocaleString('id-ID')} baris; pencarian membaca teks aktual.`;
    $('footerStatus').textContent = 'korpus .nz siap';
    updateMetrics();
    if (normalized) $('bacaan').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    $('resultNote').textContent = 'Korpus belum dapat dibaca';
    $('footerStatus').textContent = error.message;
    $('fileStatus').textContent = error.message;
    renderStories([]);
  }
}

function makeStatus(document) {
  if (document.type === 'article') {
    const integrity = document.integrity || {};
    return `Format artikel .nz; label file: ${document.editorialLabel}. ${integrity.missingTitles || 0} judul, ${integrity.missingBodies || 0} isi, ${integrity.missingSources || 0} sitasi belum lengkap. Parser tidak memverifikasi kebenaran sumber.`;
  }
  if (document.type === 'pointer') {
    return `Pointer valid; ${document.points.length} baris dibaca dari ${document.sourcePath}. Format korpus lama tidak menyimpan judul terpisah atau sitasi.`;
  }
  if (document.type === 'legacy-corpus' || document.type === 'legacy-record') {
    return 'Teks sumber lama ditampilkan apa adanya. File tidak menyediakan judul editorial atau sitasi per poin; statusnya belum diverifikasi.';
  }
  return 'File metadata/teks dibuka apa adanya; ini bukan artikel ilmiah terverifikasi.';
}

function makePointDocument(point) {
  return {
    type: 'legacy-record',
    path: NZFS.corpusPath,
    sourcePath: NZFS.corpusPath,
    title: `Poin ${point.number}`,
    category: 'Korpus .nz · rekaman sumber',
    abstract: 'Teks di bawah diambil langsung dari baris korpus gzip; judul terpisah tidak tersedia.',
    points: [point],
    range: { start: point.number, end: point.number },
    integrity: { missingTitles: 1, missingBodies: 0, missingSources: 1, parserVerified: false }
  };
}

function openPoint(point) {
  openDocument(makePointDocument(point));
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
      source.textContent = `Sumber tercatat: ${citation}`;
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
  $('readerPointCount').textContent = `${points.length.toLocaleString('id-ID')} poin dalam berkas`;
  $('readerRange').textContent = documentData.range
    ? `${documentData.range.start.toLocaleString('id-ID')}—${documentData.range.end.toLocaleString('id-ID')}`
    : points.length ? `1—${points.length.toLocaleString('id-ID')}` : 'metadata';
}

function openDocument(documentData) {
  state.readerDocument = documentData;
  state.readerOffset = 0;
  state.views += 1;
  sessionStorage.setItem('all_views', String(state.views));
  updateMetrics();
  $('readerCategory').textContent = documentData.category || documentData.type;
  $('readerTitle').textContent = documentData.title || documentData.path;
  $('readerDeck').textContent = documentData.abstract || `Isi berkas ${documentData.path} ditampilkan sesuai sumber.`;
  $('readerMeta').textContent = documentData.path;
  $('readerStatus').textContent = makeStatus(documentData);
  $('readerIntegrity').textContent = makeStatus(documentData);
  const sourcePath = documentData.path || documentData.sourcePath || '';
  const source = $('readerSource');
  source.textContent = `Buka file sumber: ${sourcePath}`;
  source.href = NZFS.url(sourcePath);
  source.title = sourcePath;
  const corpusLink = $('readerCorpusSource');
  corpusLink.replaceChildren();
  if (documentData.sourcePath && documentData.sourcePath !== sourcePath) {
    const link = document.createElement('a');
    link.href = NZFS.url(documentData.sourcePath);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `Korpus yang dirujuk: ${documentData.sourcePath}`;
    corpusLink.appendChild(link);
  }
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
    $('fileStatus').textContent = `${documentData.path} dibuka · tipe ${documentData.type} · ${documentData.points?.length || 0} poin yang dibaca.`;
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
  searchCorpus($('searchInput').value);
});
document.querySelectorAll('[data-query]').forEach(button => button.addEventListener('click', () => {
  $('searchInput').value = button.dataset.query;
  searchCorpus(button.dataset.query);
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
    $('footerStatus').textContent = 'tautan bacaan disalin';
  } catch {
    $('footerStatus').textContent = 'gunakan URL file sumber untuk berbagi';
  }
});

function start() {
  drawIndex();
  updateClock();
  updateMetrics();
  setInterval(updateClock, 1000);
  setActiveNavigation(location.hash || '#top');
  const requestedFile = new URLSearchParams(location.search).get('nz');
  if (requestedFile) openNZFile(requestedFile);
  else searchCorpus('');
}
start();
