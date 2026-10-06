// settings/validation.js - EDIT THIS FILE to change how form fields are checked and what the messages say.
// Each rule is used by inputs marked data-check="name" in the HTML (mobile, pin, gst, fssai, email).
// A rule is optional input: an empty field passes unless the field is also marked "required".

export const RULES = {
  mobile: { pattern: '^[6-9][0-9]{9}$', message: 'Enter a valid 10-digit Indian mobile number.',
            // typed formats we clean before checking: +91 98765-43210 -> 9876543210
            clean: v => v.replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=[0-9]{10}$)/, '') },
  pin:    { pattern: '^[1-9][0-9]{5}$', message: 'Enter a 6-digit PIN code.' },
  gst:    { pattern: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$', message: 'GST number is 15 characters, e.g. 22AAAAA0000A1Z5.',
            clean: v => v.trim().toUpperCase() },
  fssai:  { pattern: '^[0-9]{14}$', message: 'FSSAI licence number is 14 digits.', clean: v => v.replace(/\s/g, '') },
  email:  { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$', message: 'Enter a valid email address.' },
};

// Product photo / catalogue upload limits (seller form)
export const FILES = {
  maxFiles: 5,
  maxMB: 5,
  types: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  messages: {
    tooMany: n => `Please attach at most ${n} files.`,
    badType: name => `${name}: only JPG, PNG, WebP or PDF files are allowed.`,
    tooBig: (name, mb) => `${name} is larger than ${mb} MB.`,
  },
};
