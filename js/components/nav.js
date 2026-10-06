// Mobile menu: open / close, Esc to close, close when a link is chosen or the window grows.
export function initNav() {
  const btn = document.getElementById('burger');
  const panel = document.getElementById('mobile-menu');
  if (!btn || !panel) return;

  const set = (open) => {
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  btn.addEventListener('click', () => set(panel.hidden));
  panel.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); } });
  matchMedia('(min-width:1101px)').addEventListener('change', e => { if (e.matches) set(false); });
}
