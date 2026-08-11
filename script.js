/* ============================================================
   AI STUDIO — script.js
   Barcha media fayllar CDN/assets papkasidan yuklanadi.
   Base64 ISHLATILMAYDI — TZ talabiga muvofiq.
   ============================================================ */

/* ---- mobile nav ---- */
const burgerBtn = document.getElementById('burgerBtn');
const mainNav = document.getElementById('mainNav');
burgerBtn.addEventListener('click', () => mainNav.classList.toggle('open'));
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

/* ---- scroll reveal ---- */
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ============================================================
   PARTNERS MARQUEE — bitta logo joyi, harakatlanadigan animatsiya
   Logotipni almashtirish uchun LOGO_URL manzilini o'zgartiring.
   ============================================================ */
const LOGO_URL = "assets/images/logo.webp";
const PARTNER_LINK = "https://t.me/dunyotextil"; // hamkor bosilganda shu Telegram katalogiga o'tadi
const marqueeTrack = document.getElementById('marqueeTrack');
const slotHTML = LOGO_URL
  ? `<a class="logo-slot" href="${PARTNER_LINK}" target="_blank" rel="noopener" style="background:#fff;border:1px solid var(--line);"><img src="${LOGO_URL}" alt="Hamkor logotipi" loading="lazy" decoding="async"></a>`
  : `<div class="logo-slot">LOGO shu yerga</div>`;
marqueeTrack.innerHTML = slotHTML.repeat(10);

/* ============================================================
   MENING ISHLARIM — rasm va video alohida joylarda
   ============================================================ */
const photoGrid = document.getElementById('photoGrid');
const videoGrid = document.getElementById('videoGrid');

const REAL_PHOTOS = [
  "assets/images/portfolio/photo-01.webp",
  "assets/images/portfolio/photo-02.webp",
  "assets/images/portfolio/photo-03.webp"
];
REAL_PHOTOS.forEach((src) => {
  photoGrid.innerHTML += `<div class="work-item"><img src="${src}" alt="Rasm ish namunasi" loading="lazy" decoding="async"></div>`;
});

const REAL_VIDEOS = [
  { src: "assets/videos/video-01.mp4", poster: "assets/images/portfolio/video-01-poster.webp" },
  { src: "assets/videos/video-02.mp4", poster: "assets/images/portfolio/video-02-poster.webp" },
  { src: "assets/videos/video-03.mp4", poster: "assets/images/portfolio/video-03-poster.webp" },
  { src: "assets/videos/video-04.mp4", poster: "assets/images/portfolio/video-04-poster.webp" },
  { src: "assets/videos/video-05.mp4", poster: "assets/images/portfolio/video-05-poster.webp" },
  { src: "assets/videos/video-06.mp4", poster: "assets/images/portfolio/video-06-poster.webp" },
  { src: "assets/videos/video-07.mp4", poster: "assets/images/portfolio/video-07-poster.webp" }
];

REAL_VIDEOS.forEach(({ src, poster }) => {
  const item = document.createElement('div');
  item.className = 'work-item';
  item.innerHTML = `
    <video muted loop playsinline preload="metadata" poster="${poster}">
      <source src="${src}" type="video/mp4">
    </video>
    <div class="play"><span>▶</span></div>`;
  const video = item.querySelector('video');
  item.addEventListener('click', () => {
    if (video.paused) { video.play(); item.classList.add('playing'); }
    else { video.pause(); item.classList.remove('playing'); }
  });
  videoGrid.appendChild(item);
});

document.querySelectorAll('.work-tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.work-tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const isPhoto = btn.dataset.work === 'photo';
    document.getElementById('panel-photo').style.display = isPhoto ? 'block' : 'none';
    document.getElementById('panel-video').style.display = isPhoto ? 'none' : 'block';
  });
});

/* ============================================================
   MODEL TANLASH — bir nechta model yuzini tanlash
   Namunaviy rasmlar hozircha vaqtincha manzildan.
   Haqiqiy yuzlarni assets/images/models/ papkasiga qo'yib,
   quyidagi MODEL_IMAGES ro'yxatini shu fayl nomlariga almashtiring.
   ============================================================ */
const MODEL_IMAGES = Array.from({ length: 10 }, (_, i) =>
  `https://picsum.photos/seed/aistudio-model-${i + 1}/400/520` // TODO: assets/images/models/model-XX.webp bilan almashtiring
);

const modelGrid = document.getElementById('modelGrid');
let selectedModels = [];
MODEL_IMAGES.forEach((src, idx) => {
  const i = idx + 1;
  const card = document.createElement('div');
  card.className = 'model-card';
  card.dataset.id = i;
  card.innerHTML = `<img src="${src}" alt="Model yuzi ${i}" loading="lazy" decoding="async">
                     <span class="num">${String(i).padStart(2, '0')}</span>
                     <span class="check">✓</span>`;
  card.addEventListener('click', () => {
    card.classList.toggle('sel');
    if (card.classList.contains('sel')) { selectedModels.push(i); }
    else { selectedModels = selectedModels.filter(x => x !== i); }
    document.getElementById('selCount').textContent = selectedModels.length;
  });
  modelGrid.appendChild(card);
});

/* ============================================================
   NARX HISOBLAGICH
   ============================================================ */
const PHOTO_PRICE = 50000, VIDEO_PRICE = 100000;
let mode = 'single';
let photoQty = 0, videoQty = 0;
let selectedPkg = null;

const modeButtons = document.querySelectorAll('.mode-toggle button');
const panelSingle = document.getElementById('panel-single');
const panelPackage = document.getElementById('panel-package');

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.dataset.mode;
    panelSingle.style.display = mode === 'single' ? 'block' : 'none';
    panelPackage.style.display = mode === 'package' ? 'block' : 'none';
    render();
  });
});

document.querySelectorAll('.counter button').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    const delta = parseInt(btn.dataset.delta);
    if (target === 'photo') { photoQty = Math.max(0, photoQty + delta); document.getElementById('photoVal').textContent = photoQty; }
    if (target === 'video') { videoQty = Math.max(0, videoQty + delta); document.getElementById('videoVal').textContent = videoQty; }
    render();
  });
});

document.querySelectorAll('.pkg-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.pkg-card').forEach(c => c.classList.remove('sel'));
    card.classList.add('sel');
    selectedPkg = {
      name: card.querySelector('h4').textContent,
      price: parseInt(card.dataset.price),
      desc: card.dataset.desc
    };
    render();
  });
});

const receiptLines = document.getElementById('receiptLines');
const totalAmt = document.getElementById('totalAmt');
const orderBtn = document.getElementById('orderBtn');

function fmt(n) { return n.toLocaleString('fr-FR').replace(/,/g, ' ') + " so'm"; }

function render() {
  let lines = [];
  let total = 0;
  let orderText = "";
  const modelsTxt = selectedModels.length ? ` Tanlangan modellar: ${selectedModels.join(', ')}.` : "";

  if (mode === 'single') {
    if (photoQty > 0) { lines.push(`<div class="r-line"><span>AI Rasm × ${photoQty}</span><b>${fmt(photoQty * PHOTO_PRICE)}</b></div>`); total += photoQty * PHOTO_PRICE; }
    if (videoQty > 0) { lines.push(`<div class="r-line"><span>AI Video × ${videoQty}</span><b>${fmt(videoQty * VIDEO_PRICE)}</b></div>`); total += videoQty * VIDEO_PRICE; }
    if (lines.length === 0) { lines.push(`<div class="r-line"><span>Hali tanlanmagan</span></div>`); }
    orderText = `Salom! AI Studio orqali buyurtma bermoqchiman:%0A- AI Rasm: ${photoQty} dona%0A- AI Video: ${videoQty} dona%0AJami: ${fmt(total)}.${encodeURIComponent(modelsTxt)}`;
  } else {
    if (selectedPkg) {
      lines.push(`<div class="r-line"><span>${selectedPkg.name} paket</span><b>${fmt(selectedPkg.price)}</b></div>`);
      lines.push(`<div class="r-line"><span>${selectedPkg.desc}</span></div>`);
      total = selectedPkg.price;
      orderText = `Salom! "${selectedPkg.name}" paketini buyurtma bermoqchiman (${selectedPkg.desc}). Jami: ${fmt(total)}.${encodeURIComponent(modelsTxt)}`;
    } else {
      lines.push(`<div class="r-line"><span>Paket tanlanmagan</span></div>`);
      orderText = `Salom! AI Studio paketlari haqida ma'lumot olmoqchiman.`;
    }
  }

  receiptLines.innerHTML = lines.join('');
  totalAmt.textContent = fmt(total);
  totalAmt.classList.add('pulse');
  setTimeout(() => totalAmt.classList.remove('pulse'), 150);
  orderBtn.href = `https://t.me/share/url?url=&text=${orderText}`;
}

render();
