// Fills contact details and platform links from js/config.js. Empty values are removed, never shown as blanks.
import { SITE } from '../config.js';

export function initSiteConfig() {
  // contact lines
  document.querySelectorAll('[data-site]').forEach(el => {
    const val = (SITE.contact[el.dataset.site] || '').trim();
    if (!val) { (el.closest('.cline') || el).remove(); return; }
    el.textContent = val;
    if (el.tagName === 'A') {
      el.href = el.dataset.kind === 'tel' ? 'tel:' + val.replace(/[^\d+]/g, '') : 'mailto:' + val;
    }
  });
  // a card/section whose contact lines were all empty keeps its text and button, so nothing else to do.

  // legal-page details (settings/legal.js). Optional rows disappear when empty; numbers keep their default text.
  document.querySelectorAll('[data-legal]').forEach(el => {
    const val = String((SITE.legal || {})[el.dataset.legal] || '').trim();
    if (!val) { const row = el.closest('[data-legal-row]'); if (row) row.remove(); return; }
    el.textContent = val;
    if (el.tagName === 'A') el.href = (el.dataset.kind === 'tel' ? 'tel:' + val.replace(/[^\d+]/g, '') : 'mailto:' + val);
  });

  // platform links
  document.querySelectorAll('[data-link]').forEach(a => {
    const url = (SITE.links[a.dataset.link] || '').trim();
    if (!url) return;                                   // keep the default "coming soon" address
    a.href = url;
    if (/^https?:/i.test(url)) { a.target = '_blank'; a.rel = 'noopener'; }
  });

  // "coming soon" page: show which page was asked for
  const soon = document.querySelector('[data-soon]');
  if (soon) {
    const name = new URLSearchParams(location.search).get('p');
    if (name) { soon.textContent = name; document.title = name + ' | Streatos'; }
  }
}
