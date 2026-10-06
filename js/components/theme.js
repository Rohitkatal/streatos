// Light / dark toggle (moon / sun button). The saved choice is applied by a tiny inline script in <head> to avoid a flash.
const KEY = 'streatos-theme';
const isDark = () => {
  const t = document.documentElement.dataset.theme;
  return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
};
export function initTheme() {
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.setAttribute('aria-pressed', String(isDark()));
    btn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem(KEY, next); } catch {}
      document.querySelectorAll('[data-theme-toggle]').forEach(b => b.setAttribute('aria-pressed', String(next === 'dark')));
    });
  });
}
