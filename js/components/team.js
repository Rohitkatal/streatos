// Draws the team cards on the Our Team page from settings/team.js.
import { TEAM, TEAM_SHOW, PHOTO_DIR } from '../../settings/team.js';

const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
const initials = name => name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();

function link(href, label, icon, external) {
  const a = el('a', 'tlink');
  a.href = href; a.setAttribute('aria-label', label); a.title = label;
  if (external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  a.innerHTML = `<svg class="i" aria-hidden="true"><use href="#${icon}"/></svg><span></span>`;
  a.querySelector('span').textContent = label.startsWith('LinkedIn') ? 'LinkedIn profile' : label.replace(/^[^:]+: /, '');
  return a;
}

export function initTeam() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;
  grid.textContent = '';
  TEAM.forEach(m => {
    const card = el('article', 'card person tmember');

    const av = el('div', 'avatar notranslate');
    if (m.photo) {
      const img = new Image(); img.src = /^(https?:|\/)/.test(m.photo) ? m.photo : PHOTO_DIR + m.photo; img.alt = m.name; img.width = 88; img.height = 88; img.loading = 'lazy';
      img.addEventListener('error', () => { av.textContent = initials(m.name); img.remove(); });
      av.append(img);
    } else { av.textContent = initials(m.name); av.setAttribute('aria-hidden', 'true'); }

    const body = el('div', 'pbody');
    body.append(el('h3', 'pname notranslate', m.name));
    if (m.role) body.append(el('span', 'role', m.role));
    if (m.bio) body.append(el('p', 'pbio', m.bio));

    const links = el('div', 'tlinks');
    if (TEAM_SHOW.linkedin && m.linkedin) links.append(link(m.linkedin, `LinkedIn: ${m.name}`, 'i-linkedin', true));
    if (TEAM_SHOW.email && m.email) links.append(link(`mailto:${m.email}`, `Email: ${m.email}`, 'i-mail'));
    if (TEAM_SHOW.phone && m.phone) links.append(link(`tel:${m.phone.replace(/[^\d+]/g, '')}`, `Call: ${m.phone}`, 'i-phone'));
    if (links.children.length) body.append(links);

    card.append(av, body);
    grid.append(card);
  });
}
