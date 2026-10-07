// Count the big stats (3 / 7 / 14) up from 0 when they scroll into view.
export function initCounters() {
  const els = [...document.querySelectorAll('.stat b')];
  if (!els.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = t => 1 - Math.pow(1 - t, 3);

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      const el = e.target, end = parseInt(el.textContent, 10);
      if (Number.isNaN(end) || reduce) continue;
      const t0 = performance.now(), dur = 1400;
      el.setAttribute('aria-label', String(end));          // screen readers hear the final number once
      const tick = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(end * ease(p));
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.6 });
  els.forEach(el => io.observe(el));
}
