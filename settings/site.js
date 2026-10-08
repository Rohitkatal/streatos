// settings/site.js - EDIT THIS FILE to change contact details, form destination and page links.
// No other code needs touching. Leave a value as '' to hide it (contact) or keep the "coming soon" page (links).

export const SITE_SETTINGS = {

  // 1. FORMS - where the Vendor Registration and Contact forms are sent (POST).
  //    Paste the URL from Formspree, Web3Forms, Netlify Forms or your own Cloudflare function.
  formEndpoint: 'https://api.web3forms.com/submit',          // Web3Forms:  'https://api.web3forms.com/submit'    Formspree: 'https://formspree.io/f/xxxxxxxx'
  formAccessKey: '286360ad-1f7b-4d9b-829a-910e9db0fc37',         // Web3Forms only: the access key emailed to you. Leave '' for Formspree.
  sendFiles: false,          // false = the photo/catalogue upload is hidden (free form plans do not accept files).
                             // Set true only if your form service plan supports file uploads.

  // 2. CONTACT DETAILS - shown on the Contact page. Empty ones are hidden automatically.
  contact: {
    customerPhone: '',   // e.g. '+91 98765 43210'
    customerEmail: 'support@streatos.com',
    supportHours: '',    // e.g. 'Mon-Sat, 9:30 AM - 6:00 PM'
    vendorPhone: '',
    vendorEmail: 'business@streatos.com',
    partnerEmail: 'business@streatos.com',
    generalPhone: '',
    generalEmail: 'ceo@streatos.com',
  },

  // 3. PAGE LINKS - when a page goes live, put its address here. Buttons and footer links
  //    update everywhere automatically. Empty = the friendly "coming soon" page.
  //    Use a full address ('https://shop.streatos.com') or a file ('privacy.html').
  links: {
    shop: '',
    restaurants: '',
    mart: '',
    trackOrder: '',
    vendorLogin: '',
    // legal pages (footer)
    privacy: '',
    terms: '',
    vendorTerms: '',
    refund: '',
    shipping: '',
  },
};
