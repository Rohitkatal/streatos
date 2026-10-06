// Highlights the menu item whose section is currently on screen (the green pill, like "FAQ" in the design).
// Each menu control lists its sections in data-spy="id id id".
export function initNavSpy() {
  const items = [...document.querySelectorAll('.menu [data-spy]')];
  if (!items.length) return;

  const owner = new Map();                                   // section element -> menu item
  items.forEach(item => item.dataset.spy.split(/\s+/).forEach(id => {
    const sec = document.getElementById(id);
    if (sec) owner.set(sec, item);
  }));

  const visible = new Set();
  const paint = () => {
    // the section highest on screen wins
    const top = [...visible].sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
    const active = top ? owner.get(top) : null;
    items.forEach(it => {
      const on = it === active;
      it.classList.toggle('is-active', on);
      if (it.tagName === 'A') on ? it.setAttribute('aria-current', 'location') : it.removeAttribute('aria-current');
    });
  };

  // a section counts as "current" while it crosses a band around the middle of the viewport
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    paint();
  }, { rootMargin: '-35% 0px -55% 0px' });
  owner.forEach((_, sec) => io.observe(sec));
}
