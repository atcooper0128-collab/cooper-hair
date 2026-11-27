(() => {
  'use strict';
  const works = [
    ['return-01','灰棕白髮設計 · 本次回訪整理完成',1212,2160],
    ['warm-5','暖棕長髮 · 側面',720,1280],
    ['edit-10','中短髮',720,1280],
    ['edit-5','直髮放下來的樣子',795,1280],
    ['cool-2','冷棕長髮 · 背面',720,1280],
    ['gray-4','白髮設計 · 側面',1033,1280],
    ['edit-9','柔和灰紫',778,1280],
    ['edit-4','短髮亮色',720,1280],
    ['return-02','同次灰棕回訪 · 另一角度',1236,2160],
    ['return-03','同次灰棕回訪 · 內層顏色',1226,2160],
    ['warm-4','同組暖棕長髮 · 轉身',720,1280],
    ['gray-3','同組白髮設計 · 另一角度',837,1280],
    ['cool-1','同組冷棕長髮 · 捲髮細節',720,1280],
    ['edit-3','短髮顏色',720,1280],
    ['gray-5','同組白髮設計 · 頭頂',816,1280],
    ['warm-3','同組暖棕長髮 · 捲髮細節',720,1280],
    ['edit-6','灰棕髮色',720,1280],
    ['edit-7','短髮灰棕',720,1280],
    ['edit-8','同組短髮灰棕 · 另一角度',720,1280],
    ['edit-2','長髮 · 多角度',960,1280],
    ['edit-1','綁髮時的內層顏色',960,1280]
  ].map(([id,title,width,height]) => ({id,title,width,height}));
  const $ = s => document.querySelector(s);
  const source = w => `assets/${w.id}.${w.id.startsWith('return-') ? 'jpg' : 'webp'}`;
  const thumb = w => w.id.startsWith('return-') ? source(w) : `assets/thumbs/${w.id}.webp`;
  const grid = $('#workGrid');
  const dialog = $('#photoDialog');
  const photo = $('#largePhoto');
  let current = 0, shown = 4, opener = null;

  function renderPhoto() {
    const w = works[current];
    photo.width = w.width; photo.height = w.height;
    photo.alt = `${w.title}（COOPER 真實作品）`;
    photo.src = source(w);
    $('#photoCaption').textContent = w.title;
    $('#photoCount').textContent = `${current + 1} / ${works.length}`;
  }
  function openPhoto(id, button) {
    current = works.findIndex(w => w.id === id);
    if (current < 0) return;
    opener = button;
    renderPhoto();
    dialog.showModal();
    document.documentElement.classList.add('locked');
    $('#closePhoto').focus();
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-work]');
    if (button) openPhoto(button.dataset.work, button);
  });
  $('#moreWorks').addEventListener('click', () => {
    const batch = works.slice(shown, shown + 6);
    const fragment = document.createDocumentFragment();
    batch.forEach(w => {
      const li = document.createElement('li');
      li.className = 'work-card';
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'work-image'; button.dataset.work = w.id;
      button.setAttribute('aria-label', `放大看${w.title}`);
      const img = new Image();
      img.src = thumb(w); img.alt = `${w.title}（COOPER 真實作品）`;
      img.width = w.width; img.height = w.height; img.loading = 'lazy';
      const label = document.createElement('span'); label.textContent = '放大看照片';
      const title = document.createElement('h3'); title.textContent = w.title;
      button.append(img, label); li.append(button, title); fragment.append(li);
    });
    const firstNew = fragment.firstElementChild;
    grid.append(fragment); shown += batch.length;
    $('#moreWorks').hidden = shown >= works.length;
    firstNew?.querySelector('button').focus({preventScroll:true});
    firstNew?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
  function step(direction) { current = (current + direction + works.length) % works.length; renderPhoto(); }
  $('#prevPhoto').addEventListener('click', () => step(-1));
  $('#nextPhoto').addEventListener('click', () => step(1));
  $('#closePhoto').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('locked');
    opener?.focus({preventScroll:true});
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

  // Quiet motion preview; pause when offscreen and respect reduced-motion preferences.
  const video = $('#heroVideo');
  const toggle = $('#videoToggle');
  if (video && toggle) {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let manuallyPaused = motion.matches;
    let inView = false;
    video.muted = true;
    video.controls = false;
    toggle.hidden = false;
    function syncVideoButton() {
      toggle.textContent = video.paused ? '播放影片' : '暫停影片';
      toggle.setAttribute('aria-label', video.paused ? '播放風格示意影片' : '暫停風格示意影片');
    }
    function updatePlayback() {
      if (inView && !manuallyPaused && !document.hidden) {
        video.play().catch(syncVideoButton);
      } else video.pause();
    }
    toggle.addEventListener('click', () => {
      manuallyPaused = !video.paused;
      if (manuallyPaused) video.pause();
      else video.play().catch(syncVideoButton);
    });
    video.addEventListener('play', syncVideoButton);
    video.addEventListener('pause', syncVideoButton);
    video.addEventListener('error', () => {
      toggle.textContent = '影片暫時無法播放';
      toggle.disabled = true;
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting;
        updatePlayback();
      }, {threshold:0.3}).observe(video);
    } else { inView = true; updatePlayback(); }
    document.addEventListener('visibilitychange', updatePlayback);
    motion.addEventListener('change', event => {
      if (event.matches) { manuallyPaused = true; updatePlayback(); }
    });
    syncVideoButton();
  }
})();
