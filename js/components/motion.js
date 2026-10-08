// Gentle motion: sections fade up as they scroll into view, a thin progress line, header shadow.
// Switches itself off for visitors who set "reduce motion" and when IntersectionObserver is missing.
// Tuning: change the numbers in the CSS block "motion" in css/site.css (duration / distance).
export function initMotion() {
  const root = document.documentElement;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

  // 1. what to reveal (hero is excluded: it has its own entrance in CSS)
  const SEL = '.section .head, .section .prose, .section .card, .section .flow, .section .quote, .section .journey, .section .checks, .cta-band, .section .eyebrow + h2, .team-card, .branch-card';
  const items = [...document.querySelectorAll(SEL)].filter(el => !el.closest('.hero') && !el.closest('form') && !el.closest('.footer'));
  items.forEach(el => {
    el.classList.add('reveal');
    const sibs = el.parentElement ? [...el.parentElement.children].filter(c => c.classList.contains('reveal')) : [];
    el.style.setProperty('--d', Math.min(sibs.indexOf(el), 5) * 70 + 'ms');   // stagger inside grids, max 350ms
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach(el => io.observe(el));
  // safety net: never leave content hidden
  setTimeout(() => items.forEach(el => el.classList.add('in')), 4000);

  // 2. header shadow + progress line (one cheap rAF-throttled handler)
  const header = document.querySelector('.site-header');
  const bar = document.createElement('div'); bar.className = 'scroll-progress'; bar.setAttribute('aria-hidden', 'true'); document.body.prepend(bar);
  let ticking = false;
  const update = () => {
    const y = window.scrollY, max = root.scrollHeight - innerHeight;
    if (header) header.classList.toggle('scrolled', y > 8);
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}
