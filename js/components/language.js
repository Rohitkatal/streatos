// Language switcher: custom dropdown (all major Indian languages) driven by Google's website translator.
// - Our UI is shown; Google's own widget is hidden off-screen and controlled from here.
// - The translator script is only downloaded when a visitor opens the menu or already chose a language.
// - Machine translation: needs internet, quality varies by language. If a language is not supported
//   the page stays in English and a short message is shown.

const LANGS = [
  { c: 'en',      n: 'English',     e: 'English' },
  { c: 'hi',      n: 'हिन्दी',        e: 'Hindi' },
  { c: 'bn',      n: 'বাংলা',        e: 'Bengali' },
  { c: 'te',      n: 'తెలుగు',       e: 'Telugu' },
  { c: 'mr',      n: 'मराठी',        e: 'Marathi' },
  { c: 'ta',      n: 'தமிழ்',        e: 'Tamil' },
  { c: 'ur',      n: 'اردو',         e: 'Urdu' },
  { c: 'gu',      n: 'ગુજરાતી',      e: 'Gujarati' },
  { c: 'kn',      n: 'ಕನ್ನಡ',        e: 'Kannada' },
  { c: 'ml',      n: 'മലയാളം',      e: 'Malayalam' },
  { c: 'or',      n: 'ଓଡ଼ିଆ',        e: 'Odia' },
  { c: 'pa',      n: 'ਪੰਜਾਬੀ',       e: 'Punjabi' },
  { c: 'as',      n: 'অসমীয়া',      e: 'Assamese' },
  { c: 'mai',     n: 'मैथिली',       e: 'Maithili' },
  { c: 'sa',      n: 'संस्कृतम्',     e: 'Sanskrit' },
  { c: 'ne',      n: 'नेपाली',       e: 'Nepali' },
  { c: 'sd',      n: 'سنڌي',         e: 'Sindhi' },
  { c: 'doi',     n: 'डोगरी',        e: 'Dogri' },
  { c: 'gom',     n: 'कोंकणी',       e: 'Konkani' },
  { c: 'mni-Mtei',n: 'Meiteilon',   e: 'Manipuri' },
  { c: 'ks',      n: 'کٲشُر',        e: 'Kashmiri',  beta: true },
  { c: 'brx',     n: 'बर\u2019',      e: 'Bodo',      beta: true },
  { c: 'sat',     n: 'Santali',     e: 'Santali',   beta: true },
  { c: 'bho',     n: 'भोजपुरी',      e: 'Bhojpuri' },
  { c: 'lus',     n: 'Mizo',        e: 'Mizo' },
];
const BY_CODE = Object.fromEntries(LANGS.map(l => [l.c, l]));
const CODES = LANGS.filter(l => l.c !== 'en').map(l => l.c).join(',');

/* ---------- cookie helpers (Google's translator reads the "googtrans" cookie) ---------- */
const readCode = () => {
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
  return m ? decodeURIComponent(m[1]) : 'en';
};
const writeCookie = (code) => {
  const base = `googtrans=/en/${code};max-age=31536000;path=/`;
  document.cookie = base;
  if (location.hostname.includes('.')) document.cookie = `${base};domain=.${location.hostname}`;
};
const clearCookie = () => {
  const gone = 'googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  document.cookie = gone;
  document.cookie = `${gone};domain=${location.hostname}`;
  document.cookie = `${gone};domain=.${location.hostname}`;
};
const isTranslated = () => /translated-(ltr|rtl)/.test(document.documentElement.className);

const waitFor = (test, ms = 5000, step = 100) => new Promise(res => {
  const t0 = performance.now();
  (function poll() {
    const v = test();
    if (v) return res(v);
    if (performance.now() - t0 > ms) return res(null);
    setTimeout(poll, step);
  })();
});

/* ---------- translator engine ---------- */
let enginePromise;
function loadEngine() {
  return (enginePromise ??= new Promise((resolve, reject) => {
    const holder = document.createElement('div');
    holder.id = 'google_translate_element';
    holder.className = 'notranslate';
    holder.setAttribute('translate', 'no');
    document.body.appendChild(holder);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: CODES, autoDisplay: false }, 'google_translate_element');
      resolve();
    };
    const s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    s.onerror = () => { enginePromise = null; reject(new Error('translator blocked or offline')); };
    document.head.appendChild(s);
  }));
}

/* ---------- UI ---------- */
const instances = [];
let uid = 0, toastEl, toastTimer;

function toast(msg) {
  toastEl ??= Object.assign(document.createElement('div'), { className: 'lang-toast notranslate' });
  toastEl.setAttribute('role', 'status'); toastEl.setAttribute('translate', 'no');
  toastEl.textContent = msg; document.body.appendChild(toastEl);
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.remove(), 4500);
}

function build(mount) {
  const id = 'lang-list-' + (++uid);
  const inline = mount.hasAttribute('data-inline');
  mount.classList.add('lang', 'notranslate');
  mount.setAttribute('translate', 'no');
  mount.innerHTML = `
    <button class="lang-btn" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}" aria-label="Choose language">
      <svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
      <span class="lang-cur">English</span>
      <svg class="i chev" aria-hidden="true"><use href="#i-chev"/></svg>
    </button>
    <div class="lang-panel" hidden>
      <p class="lang-note">Choose your language</p>
      <ul class="lang-list" id="${id}" role="listbox" aria-label="Languages">
        ${LANGS.map(l => `<li role="option" tabindex="-1" lang="${l.c === 'mni-Mtei' ? 'mni' : l.c}" data-code="${l.c}"${l.beta ? ' data-beta' : ''} aria-selected="false"><b>${l.n}</b><span>${l.e}</span></li>`).join('')}
      </ul>
      <p class="lang-foot">Automatic translation. Wording may not be perfect.</p>
    </div>`;
  const btn = mount.querySelector('.lang-btn');
  const panel = mount.querySelector('.lang-panel');
  const list = mount.querySelector('.lang-list');
  const items = [...list.children];

  const open = () => {
    instances.forEach(i => i !== api && i.close());
    panel.hidden = false; btn.setAttribute('aria-expanded', 'true');
    loadEngine().catch(() => {});                       // warm up the translator while the menu is open
    (items.find(li => li.getAttribute('aria-selected') === 'true') || items[0]).focus();
  };
  const close = (focusBtn) => { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (focusBtn) btn.focus(); };
  const api = {
    close, mount,
    show(code) {
      const l = BY_CODE[code] || BY_CODE.en;
      btn.querySelector('.lang-cur').textContent = l.n;
      btn.querySelector('.lang-cur').setAttribute('lang', l.c);
      items.forEach(li => li.setAttribute('aria-selected', String(li.dataset.code === l.c)));
    },
  };
  instances.push(api);

  btn.addEventListener('click', () => (panel.hidden ? open() : close()));
  btn.addEventListener('keydown', e => { if (e.key === 'ArrowDown' && panel.hidden) { e.preventDefault(); open(); } });
  list.addEventListener('click', e => { const li = e.target.closest('li'); if (li) { choose(li.dataset.code); close(true); } });
  list.addEventListener('keydown', e => {
    const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[Math.min(i + 1, items.length - 1)].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[Math.max(i - 1, 0)].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (i >= 0) { choose(items[i].dataset.code); close(true); } }
    else if (e.key === 'Escape') { e.stopPropagation(); close(true); }
    else if (e.key === 'Tab') close();
  });
  document.addEventListener('click', e => { if (!mount.contains(e.target)) close(); });
  if (!inline) document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  return api;
}

const showAll = (code) => instances.forEach(i => i.show(code));

async function choose(code) {
  const prev = readCode();
  if (code === prev) return;

  if (code === 'en') {                                   // back to the original page
    clearCookie(); showAll('en');
    if (isTranslated()) location.reload();
    return;
  }

  showAll(code);                                         // optimistic label
  try {
    await loadEngine();
    const combo = await waitFor(() => document.querySelector('select.goog-te-combo'), 5000);
    if (!combo) throw new Error('translator did not start');
    combo.value = code;
    if (combo.value !== code) throw new Error('language not offered by translator');
    combo.dispatchEvent(new Event('change'));
    if (!(await waitFor(isTranslated, 8000))) throw new Error('page was not translated');
    writeCookie(code);
  } catch (err) {
    console.warn('[language]', err.message);
    showAll(prev);
    toast(`${BY_CODE[code].e} translation isn\u2019t available right now. Showing ${BY_CODE[prev]?.e || 'English'}.`);
  }
}

export function initLanguage() {
  document.querySelectorAll('[data-lang-switcher]').forEach(build);
  if (!instances.length) return;

  const saved = readCode();
  showAll(BY_CODE[saved] ? saved : 'en');
  if (saved !== 'en' && BY_CODE[saved]) {                // returning visitor: translate on load
    loadEngine().catch(() => { clearCookie(); showAll('en'); });
  }
}
