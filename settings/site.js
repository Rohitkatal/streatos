// settings/site.js - EDIT THIS FILE to change contact details, form destination and page links.
// No other code needs touching. Leave a value as '' to hide it (contact) or keep the "coming soon" page (links).

export const SITE_SETTINGS = {

  // 1. FORMS - where the Seller Registration and Contact forms are sent (POST).
  //    Paste the URL from Formspree, Web3Forms, Netlify Forms or your own Cloudflare function.
  formEndpoint: '',

  // 2. CONTACT DETAILS - shown on the Contact page. Empty ones are hidden automatically.
  contact: {
    customerPhone: '',   // e.g. '+91 98765 43210'
    customerEmail: '',
    supportHours: '',    // e.g. 'Mon-Sat, 9:30 AM - 6:00 PM'
    sellerPhone: '',
    sellerEmail: '',
    partnerEmail: '',
    generalPhone: '',
    generalEmail: '',
  },

  // 3. PAGE LINKS - when a page goes live, put its address here. Buttons and footer links
  //    update everywhere automatically. Empty = the friendly "coming soon" page.
  //    Use a full address ('https://shop.streatos.com') or a file ('privacy.html').
  links: {
    shop: '',
    restaurants: '',
    mart: '',
    trackOrder: '',
    sellerLogin: '',
    // legal pages (footer)
    privacy: '',
    terms: '',
    sellerTerms: '',
    refund: '',
    shipping: '',
  },
};
