// Vendor registration + contact forms: validation, honeypot spam trap, sending, friendly messages.
import { SITE } from '../config.js';

const MSG = {
  vendor:  ['Thank you for registering.', 'Our team will review your information and connect you with the appropriate Streatos branch for the next steps.'],
  contact: ['Thank you.', 'Your enquiry has been received.'],
};

export function initForms() {
  document.querySelectorAll('form[data-form]').forEach(form => {
    prefill(form);
    if (!SITE.sendFiles) form.querySelectorAll('input[type=file]').forEach(f => (f.closest('.field') || f).remove());   // no uploads unless enabled
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      const trap = form.querySelector('[name="company_website"]');
      if (trap && trap.value) return;                                   // bots fill the hidden field

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const btn = form.querySelector('[type="submit"]');
      const label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending\u2026'; status.textContent = ''; status.className = 'form-status';

      try {
        if (!SITE.formEndpoint) throw new Error('formEndpoint is not set in js/config.js');
        const fd = new FormData(form);
        fd.delete('company_website');
        fd.append('form', form.dataset.form);
        fd.append('page', location.href);
        if (SITE.formAccessKey) {                                         // Web3Forms needs these two fields
          fd.append('access_key', SITE.formAccessKey);
          if (!fd.get('subject')) fd.append('subject', 'Streatos: new vendor registration from ' + (fd.get('businessName') || fd.get('fullName') || 'website'));
          fd.append('from_name', 'Streatos website');
        }
        if (!SITE.sendFiles) fd.delete('photos');
        const res = await fetch(SITE.formEndpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('server answered ' + res.status);
        const [title, text] = MSG[form.dataset.form] || MSG.contact;
        form.innerHTML = `<div class="form-done" role="status"><h3></h3><p></p></div>`;
        form.querySelector('h3').textContent = title;
        form.querySelector('p').textContent = text;
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (err) {
        console.warn('[forms]', err.message);
        status.className = 'form-status err';
        status.textContent = 'We could not send this just now. Please check your connection and try again, or contact us directly using the details on the Contact page.';
        btn.disabled = false; btn.textContent = label;
      }
    });
  });
}

// ?subject=...&role=...  fills the contact form (used by buttons on other pages)
function prefill(form) {
  const q = new URLSearchParams(location.search);
  const subject = q.get('subject'), role = q.get('role');
  const s = form.querySelector('[name="subject"]');
  if (subject && s && !s.value) s.value = subject;
  if (role) form.querySelectorAll('[name="role"]').forEach(r => { if (r.value === role) r.checked = true; });
}
