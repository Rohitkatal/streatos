// "Find a Branch": filters the list in js/config.js by state / district / city / PIN.
import { SITE } from '../config.js';

export function initBranches() {
  const form = document.getElementById('branch-form');
  const out = document.getElementById('branch-results');
  if (!form || !out) return;

  const has = (hay, needle) => !needle || (hay || '').toLowerCase().includes(needle.toLowerCase());

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(form));
    const hits = SITE.branches.filter(b => has(b.state, v.state) && has(b.district, v.district) && has(b.city, v.city) && has(b.pin, v.pin));
    out.textContent = '';

    if (!hits.length) {
      const c = document.createElement('div'); c.className = 'card flat';
      c.innerHTML = '<h3>Our branch network is being developed.</h3><p></p><a class="btn btn-ghost" href="contact.html?subject=Branch%20enquiry#contact-form">Tell us your location</a>';
      c.querySelector('p').textContent = SITE.branches.length
        ? 'We could not find a branch for that search yet. Try a nearby city, or tell us where you are and we will connect you.'
        : 'We are opening branches step by step. Tell us where you are and our team will connect you with the nearest support.';
      out.appendChild(c);
      return;
    }
    hits.forEach(b => {
      const c = document.createElement('div'); c.className = 'card flat';
      const h = document.createElement('h3'); h.textContent = b.name;
      const p = document.createElement('p');
      p.textContent = [b.address, [b.city, b.district, b.state].filter(Boolean).join(', '), b.pin].filter(Boolean).join(' \u00B7 ');
      c.append(h, p);
      if (b.phone) { const t = document.createElement('p'); t.textContent = b.phone; c.append(t); }
      out.appendChild(c);
    });
  });
}
