// Fade/slide elements in as they enter the viewport.
const TARGETS = '.head, .card, .stat, .rail, .rail li, .cycle li, .path, .pack, .stage3d';

export function initReveal() {
  const els = [...document.querySelectorAll(TARGETS)].filter(el => !el.closest('.mm-panel, .mobile'));
  if (!els.length) return;

  els.forEach(el => {
    el.setAttribute('data-reveal', '');
    // stagger siblings: 0, 70, 140 ... ms
    const i = [...el.parentElement.children].indexOf(el);
    el.style.setProperty('--d', Math.min(i, 6) * 70 + 'ms');
  });

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      io.unobserve(el);
      el.classList.add('in');
      // after the animation, drop the attribute so your original hover transitions come back
      setTimeout(() => { el.removeAttribute('data-reveal'); el.style.removeProperty('--d'); }, 1000);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  els.forEach(el => io.observe(el));
}
