// 3D tilt + moving glare on cards. Only on devices with a real mouse.
export function initTilt(selector = '.card') {
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (!fine || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll(selector).forEach(card => {
    card.classList.add('tilt');
    let raf = 0;
    const MAX = 9; // degrees

    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.setProperty('--ry', ((px - .5) * MAX * 2).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((.5 - py) * MAX * 2).toFixed(2) + 'deg');
        card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      });
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}
