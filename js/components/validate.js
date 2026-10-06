// Format checks for fields marked data-check="mobile|pin|gst|fssai|email" using the rules in settings/validation.js.
// Uses the browser's own validity system, so the existing form code and popups keep working.
import { RULES, FILES } from '../../settings/validation.js';

function check(el) {
  const rule = RULES[el.dataset.check];
  if (!rule) return;
  let v = el.value;
  if (rule.clean) { const c = rule.clean(v); if (c !== v) { el.value = c; v = c; } }
  const bad = v.trim() !== '' && !new RegExp(rule.pattern).test(v.trim());
  el.setCustomValidity(bad ? rule.message : '');
  el.toggleAttribute('aria-invalid', bad);
}

function checkFiles(el) {
  const files = [...el.files], M = FILES.messages;
  let msg = '';
  if (files.length > FILES.maxFiles) msg = M.tooMany(FILES.maxFiles);
  else for (const f of files) {
    if (!FILES.types.includes(f.type)) { msg = M.badType(f.name); break; }
    if (f.size > FILES.maxMB * 1048576) { msg = M.tooBig(f.name, FILES.maxMB); break; }
  }
  el.setCustomValidity(msg);
}

export function initValidation() {
  document.querySelectorAll('[data-check]').forEach(el => {
    el.removeAttribute('pattern');               // rules live in settings/validation.js, not in the HTML
    el.addEventListener('input', () => check(el));
    el.addEventListener('blur', () => check(el));
    check(el);
  });
  document.querySelectorAll('input[type=file]').forEach(el => el.addEventListener('change', () => checkFiles(el)));
}
