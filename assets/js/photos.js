// Side-photo windows: slow parallax drift, closable, and click to enlarge.
// Settings for each photo live in _data/photos.yml.
(() => {
  const REOPEN_MS = 15 * 1000;        // a closed photo comes back after 15 seconds
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

  // ---- enlarged view ("lightbox") ----
  // The same window grows from its spot in the margin to the middle of the
  // screen, and shrinks back when closed. Uses /assets/images/large/ copies
  // when they exist (data-large), falling back to the small image.
  const tpl = document.getElementById('photo-lightbox-tpl');
  if(!tpl) return;
  const dlg = tpl.content.firstElementChild.cloneNode(true);
  document.body.appendChild(dlg);
  const backdrop = dlg.querySelector('.lb-backdrop');
  const lbWin = dlg.querySelector('.lb-win');
  const lbImg = lbWin.querySelector('img');
  let source = null, busy = false;

  // never wait on an animation for long (browsers pause them in background tabs)
  const run = (el, frames) => Promise.race([
    el.animate(frames, { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' }).finished,
    new Promise(r => setTimeout(r, 450)),
  ]);
  // transform that makes the big window sit exactly over `rect`
  const onto = (rect) => {
    const to = lbWin.getBoundingClientRect();
    return `translate(${rect.left - to.left}px, ${rect.top - to.top}px) scale(${rect.width / to.width})`;
  };
  const layout = () => {
    const img = source.querySelector('img');
    const ratio = img.offsetWidth / img.offsetHeight;
    lbImg.style.aspectRatio = String(ratio);
    const chrome = lbWin.offsetHeight - lbImg.offsetHeight;   // title bar + borders
    const w = Math.min(innerWidth * 0.9, 1100, (innerHeight * 0.88 - chrome) * ratio);
    lbWin.style.width = `${w}px`;
    lbWin.style.left = `${(innerWidth - w) / 2}px`;
    lbWin.style.top = `${(innerHeight - lbWin.offsetHeight) / 2}px`;
  };

  const open = async (el) => {
    if(busy || dlg.open) return;
    busy = true; source = el;
    const win = el.querySelector('.photo-win'), img = el.querySelector('img');
    lbWin.querySelector('.photo-title').textContent = el.querySelector('.photo-title').textContent;
    lbImg.alt = img.alt;
    lbImg.src = img.currentSrc || img.src;                    // already loaded: shows instantly
    const large = img.dataset.large;
    if(large && !lbImg.src.endsWith(large)){
      const hi = new Image();
      hi.onload = () => { if(source === el) lbImg.src = large; };
      hi.src = large;
    }
    document.documentElement.classList.add('lb-open');
    dlg.showModal();
    layout();
    const from = win.getBoundingClientRect();
    win.style.visibility = 'hidden';
    await Promise.all([
      run(lbWin, reduce.matches ? [{ opacity: 0 }, { opacity: 1 }] : [{ transform: onto(from) }, { transform: 'none' }]),
      run(backdrop, [{ opacity: 0 }, { opacity: 1 }]),
    ]);
    busy = false;
  };

  const close = async () => {
    if(busy || !dlg.open) return;
    busy = true;
    const win = source.querySelector('.photo-win');
    const to = win.getBoundingClientRect();
    await Promise.all([
      run(lbWin, reduce.matches ? [{ opacity: 1 }, { opacity: 0 }] : [{ transform: 'none' }, { transform: onto(to) }]),
      run(backdrop, [{ opacity: 1 }, { opacity: 0 }]),
    ]);
    win.style.visibility = '';
    dlg.close();
    document.documentElement.classList.remove('lb-open');
    [lbWin, backdrop].forEach(el => el.getAnimations().forEach(a => a.cancel()));
    source = null; busy = false;
  };

  photos.forEach(el => {
    el.querySelector('.photo-zoom').addEventListener('click', () => open(el));
    el.querySelector('img').addEventListener('click', () => open(el));
  });
  [backdrop, lbImg, dlg.querySelector('.lb-zoom'), dlg.querySelector('.lb-x')]
    .forEach(t => t.addEventListener('click', close));
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });   // Esc
  window.addEventListener('resize', () => { if(dlg.open && !busy) layout(); });
})();
