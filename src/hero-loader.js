const initHeroLoader = () => {
  const carousel = document.querySelector('.heroCarousel');
  if (!carousel || carousel.dataset.loaderReady === 'true') return false;

  carousel.dataset.loaderReady = 'true';
  carousel.classList.add('is-loading');

  const loader = document.createElement('div');
  loader.className = 'heroAssetLoader';
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-live', 'polite');
  loader.innerHTML = `
    <div class="heroLoaderBrand">KJ</div>
    <div class="heroLoaderCopy">
      <b>Memuat visual high-resolution</b>
      <span class="heroLoaderStatus">Menyiapkan gambar...</span>
    </div>
    <div class="heroLoaderTrack"><i style="width:0%"></i></div>
    <strong class="heroLoaderPercent">0%</strong>
  `;
  carousel.appendChild(loader);

  const images = [...carousel.querySelectorAll('.heroSlide')];
  if (!images.length) return true;

  let loaded = 0;
  const completed = new Set();
  const status = loader.querySelector('.heroLoaderStatus');
  const percent = loader.querySelector('.heroLoaderPercent');
  const bar = loader.querySelector('.heroLoaderTrack i');

  const update = (index, ok = true) => {
    if (completed.has(index)) return;
    completed.add(index);
    loaded += 1;
    const progress = Math.round((loaded / images.length) * 100);
    bar.style.width = `${progress}%`;
    percent.textContent = `${progress}%`;
    status.textContent = ok ? `Visual ${loaded} dari ${images.length} siap` : 'Mencoba memuat ulang visual...';

    if (loaded === images.length) {
      Promise.all(images.map((img) => img.decode?.().catch(() => undefined))).finally(() => {
        requestAnimationFrame(() => {
          carousel.classList.remove('is-loading');
          carousel.classList.add('is-ready');
          loader.classList.add('is-complete');
          window.setTimeout(() => loader.remove(), 450);
        });
      });
    }
  };

  images.forEach((img, index) => {
    img.loading = 'eager';
    img.decoding = 'async';
    if (index === 0) img.setAttribute('fetchpriority', 'high');

    if (img.complete && img.naturalWidth > 0) {
      update(index, true);
      return;
    }

    img.addEventListener('load', () => update(index, true), { once: true });
    img.addEventListener('error', () => {
      // Do not expose a half-loaded/broken frame. Retry once with a cache-busting token.
      if (!img.dataset.heroRetried) {
        img.dataset.heroRetried = 'true';
        const separator = img.src.includes('?') ? '&' : '?';
        img.src = `${img.src}${separator}hero_retry=${Date.now()}`;
        return;
      }
      update(index, false);
    }, { once: false });
  });

  return true;
};

if (!initHeroLoader()) {
  const observer = new MutationObserver(() => {
    if (initHeroLoader()) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 10000);
}
