// Hero depth: each <g data-depth> layer of the SVG moves a different amount with the mouse and on scroll.
// data-depth: 0 = far away (moves little with mouse, lags most on scroll), 1 = close.
export function initParallax() {
  const scene = document.querySelector('.scene');
  const svg = scene?.querySelector('svg.bg');
  if (!scene || !svg) return;

  // light rays, anchored to the real position of the sun in the artwork
  const rays = document.createElement('div');
  rays.className = 'rays';
  rays.setAttribute('aria-hidden', 'true');
  scene.prepend(rays);
  const sun = svg.querySelector('#sun-disc');
  const placeRays = () => {
    if (!sun) return;
    const s = scene.getBoundingClientRect(), r = sun.getBoundingClientRect();
    // rays box is inset:-20%, so offset by that margin
    rays.style.setProperty('--sx', (r.left + r.width / 2 - s.left + s.width * .2) + 'px');
    rays.style.setProperty('--sy', (r.top + r.height / 2 - s.top + s.height * .2) + 'px');
  };
  placeRays();
  new ResizeObserver(placeRays).observe(scene);

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layers = [...svg.querySelectorAll(':scope > [data-depth]')].map(el => ({ el, d: parseFloat(el.dataset.depth) }));
  let mx = 0, my = 0, tx = 0, ty = 0, sy = 0, running = false, visible = true;

  scene.addEventListener('pointermove', (e) => {
    const r = scene.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - .5;
    my = (e.clientY - r.top) / r.height - .5;
    start();
  });
  scene.addEventListener('pointerleave', () => { mx = my = 0; start(); });
  addEventListener('scroll', () => { sy = Math.min(scrollY, scene.offsetHeight); start(); }, { passive: true });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(scene);

  function frame() {
    tx += (mx - tx) * .06; ty += (my - ty) * .06;               // smooth follow
    for (const { el, d } of layers) {
      const x = -tx * d * 38;                                    // user units of the 1600x800 viewBox
      const y = -ty * d * 16 + sy * (1 - d) * .10;
      el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
    }
    const settled = Math.abs(mx - tx) < .001 && Math.abs(my - ty) < .001;
    if (visible && !settled) requestAnimationFrame(frame); else running = false;
  }
  function start() { if (!running && visible) { running = true; requestAnimationFrame(frame); } }
}
