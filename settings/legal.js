// settings/legal.js - EDIT THIS FILE to change the details printed on the legal pages
// (Privacy Policy, Terms, Vendor Terms, Refund & Cancellation, Shipping). No other code needs touching.
// Leave a value as '' to hide that line (only for lines that are optional, marked below).

export const LEGAL = {
  lastUpdated: '9 October 2026',      // change this whenever you edit a policy
  businessName: 'Streatos',           // your registered business / company name, e.g. 'Streatos Pvt. Ltd.'
  address: '',                        // optional: registered address (shown on Privacy and Terms)
  gstin: '',                          // optional: GST number
  grievanceName: '',                  // optional: name of the Grievance Officer
  grievanceEmail: 'support@streatos.com',
  grievancePhone: '',                 // optional
  jurisdictionCity: '',               // optional: e.g. 'Jammu'. Courts of this city get jurisdiction. Empty = "courts in India"

  // numbers used in the Refund and Shipping policies - change them to match how you really operate
  reportDays: '2',                    // days after delivery in which a damaged / wrong item must be reported
  refundDays: '7',                    // business days to complete a refund after it is approved
  dispatchDays: '1 to 3 business days',
  deliveryDays: '3 to 10 business days',
};
