# Streatos website

Plain HTML + CSS + a little JavaScript. No frameworks, no build step.

## Where to change things (you never need to touch the code in /js)

| I want to...                                   | Edit this file              |
|------------------------------------------------|-----------------------------|
| Set where the forms are sent                   | `settings/site.js`  (formEndpoint) |
| Add phone numbers / emails / support hours     | `settings/site.js`  (contact) |
| Point Shop, Restaurants, Mart, Track Order, Seller Login, Privacy, Terms, Refund, Shipping to real pages | `settings/site.js`  (links) |
| Add / remove team members, add designations, photos, LinkedIn, hide phone or email | `settings/team.js` (photos go in `images/team/`) |
| Add Streatos branches for "Find a Branch"      | `settings/branches.js` |
| Change how mobile / PIN / GST / FSSAI / email are checked, their messages, or photo upload limits | `settings/validation.js` |
| Change words on a page                         | that page's `.html` file (header/footer are repeated on every page) |
| Change colours, fonts, spacing                 | `css/site.css` (colours are variables at the top) |

Anything left empty in `settings/site.js` is hidden (contact) or opens the friendly "coming soon" page (links).

## Make the forms work
Forms need somewhere to send data. Use Formspree, Web3Forms or Netlify Forms (each gives a form URL) and paste it into `formEndpoint` in `settings/site.js`.

## Folder map
- `settings/`   things you edit (site.js, branches.js, team.js, validation.js)
- `images/team/` team photos
- `js/config.js` joins the settings for the code. Do not edit.
- `js/components/` one small file per feature (theme, nav, language, forms, validate, branches, site-config)
- `css/site.css` styles
- `*.html` pages: index, about, team, sell, contact, soon, 404

## Run locally
`python3 -m http.server 8000` then open http://localhost:8000

## Deploy (Cloudflare Pages)
Build command: leave empty. Output directory: `/`. The repo root must contain index.html.
