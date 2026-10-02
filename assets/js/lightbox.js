// Enlarged view ("lightbox") for any photo window with a magnifier button:
// the side photos and project screenshots. The window grows from its spot to
// the middle of the screen and shrinks back when closed. Uses the image's
// data-large copy when there is one, falling back to the image itself.
(() => {
  const tpl = document.getElementById('photo-lightbox-tpl');
  const wins = [...document.querySelectorAll('.photo-win')].filter(w => w.querySelector('.photo-zoom'));
  if(!tpl || !wins.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
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
    const ratio = img.naturalWidth ? img.naturalWidth / img.naturalHeight
                : img.offsetHeight ? img.offsetWidth / img.offsetHeight : 4 / 3;
    lbImg.style.aspectRatio = String(ratio);
    const chrome = lbWin.offsetHeight - lbImg.offsetHeight;   // title bar + borders
    const w = Math.min(innerWidth * 0.9, 1100, (innerHeight * 0.88 - chrome) * ratio);
    lbWin.style.width = `${w}px`;
    lbWin.style.left = `${(innerWidth - w) / 2}px`;
    lbWin.style.top = `${(innerHeight - lbWin.offsetHeight) / 2}px`;
  };

  const open = async (win) => {
    if(busy || dlg.open) return;
    busy = true; source = win;
    const img = win.querySelector('img');
    if(!img.naturalWidth){                                    // not loaded yet: wait briefly so we know its shape
      img.loading = 'eager';
      await Promise.race([img.decode().catch(() => {}), new Promise(r => setTimeout(r, 1000))]);
    }
    lbWin.querySelector('.photo-title').textContent = win.querySelector('.photo-title').textContent;
    lbImg.alt = img.alt;
    lbImg.src = img.currentSrc || img.src;                    // already loaded: shows instantly
    const large = img.dataset.large;
    if(large && !lbImg.src.endsWith(large)){
      const hi = new Image();
      hi.onload = () => { if(source === win) lbImg.src = large; };
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
    const to = source.getBoundingClientRect();
    await Promise.all([
      run(lbWin, reduce.matches ? [{ opacity: 1 }, { opacity: 0 }] : [{ transform: 'none' }, { transform: onto(to) }]),
      run(backdrop, [{ opacity: 1 }, { opacity: 0 }]),
    ]);
    source.style.visibility = '';
    dlg.close();
    document.documentElement.classList.remove('lb-open');
    [lbWin, backdrop].forEach(el => el.getAnimations().forEach(a => a.cancel()));
    source = null; busy = false;
  };

  wins.forEach(win => {
    win.querySelector('.photo-zoom').addEventListener('click', () => open(win));
    win.querySelector('img').addEventListener('click', () => open(win));
  });
  [backdrop, lbImg, dlg.querySelector('.lb-zoom'), dlg.querySelector('.lb-x')]
    .forEach(t => t.addEventListener('click', close));
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });   // Esc
  window.addEventListener('resize', () => { if(dlg.open && !busy) layout(); });
})();
