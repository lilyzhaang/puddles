// Side-photo windows on the home page: slow parallax drift + closable windows.
// Settings for each photo live in _data/photos.yml.
(() => {
  const REOPEN_MS = 3 * 60 * 1000;   // a closed photo comes back after 3 minutes
  const KEY = 'closedPhotos';        // localStorage: { [photo src]: closedAt timestamp }

  const stage = document.getElementById('photo-stage');
  if(!stage) return;
  const photos = [...stage.querySelectorAll('.side-photo')];
  if(!photos.length) return;

  // ---- closing / reopening ----
  const load = () => { try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } };
  const save = (o) => { try{ localStorage.setItem(KEY, JSON.stringify(o)); }catch(e){} };

  const reopen = (el) => {
    const closed = load(); delete closed[el.dataset.id]; save(closed);
    el.querySelector('.photo-win').classList.remove('closed', 'no-anim');
  };
  const scheduleReopen = (el, closedAt) => {
    setTimeout(() => reopen(el), Math.max(0, closedAt + REOPEN_MS - Date.now()));
  };

  const closed = load(), now = Date.now();
  photos.forEach(el => {
    const win = el.querySelector('.photo-win');
    const at = closed[el.dataset.id];
    if(at && now - at < REOPEN_MS){
      win.classList.add('closed', 'no-anim');   // already closed: hide without animating
      scheduleReopen(el, at);
    } else if(at){
      delete closed[el.dataset.id];             // expired
    }
    el.querySelector('.photo-x').addEventListener('click', () => {
      const t = Date.now(), c = load(); c[el.dataset.id] = t; save(c);
      win.classList.remove('no-anim');
      win.classList.add('closed');
      scheduleReopen(el, t);
    });
  });
  save(closed);

  // ---- parallax drift ----
  // Each photo moves by (viewportCenter - photoCenter) * speed, so it trails the page.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const wide = window.matchMedia('(min-width: 1200px)');
  let centers = [], ticking = false;

  const measure = () => {
    const stageTop = stage.getBoundingClientRect().top + window.scrollY;
    centers = photos.map(el => stageTop + el.offsetTop + el.offsetHeight / 2);
  };
  const drift = () => {
    ticking = false;
    const still = reduce.matches || !wide.matches;
    const vc = window.scrollY + window.innerHeight / 2;
    photos.forEach((el, i) => {
      const y = still ? 0 : (vc - centers[i]) * parseFloat(el.dataset.speed);
      el.style.transform = y ? `translate3d(0, ${y.toFixed(1)}px, 0)` : '';
    });
  };
  const request = () => { if(!ticking){ ticking = true; requestAnimationFrame(drift); } };
  const refresh = () => { measure(); request(); };

  refresh();
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', refresh);
  window.addEventListener('load', refresh);
  reduce.addEventListener('change', refresh);
  wide.addEventListener('change', refresh);
})();
