// Adds the scroll-progress bar element. The animation itself is pure CSS (see effects.css).
export function initProgress() {
  if (!CSS.supports('animation-timeline: scroll()')) return;
  const bar = document.createElement('div');
  bar.className = 'progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);
}
