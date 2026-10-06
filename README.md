# Streatos - component-based upgrade (2D + 3D)

## Run it
ES modules need a web server (double-clicking index.html will NOT work):

    cd streatos
    python3 -m http.server 8000      # then open http://localhost:8000
    # or: npx serve    |    or: VS Code "Live Server"

Three.js loads from the jsDelivr CDN (pinned to 0.170.0) through the importmap in index.html.

## Structure
    index.html                  your page, now linking css/ + js/ (SVG hero wrapped in depth layers)
    css/base.css                your ORIGINAL styles (unchanged)
    css/effects.css             all NEW styles
    js/main.js                  entry point, starts each component safely
    js/lib/three-loader.js      lazy Three.js loader, WebGL check, reduced-motion helper
    js/components/
      site-ui.js                your ORIGINAL menu / tabs / theme script (unchanged)
      progress.js               scroll progress bar (CSS scroll-driven animation)
      reveal.js                 fade/slide-in on scroll
      counters.js               stats count up
      tilt.js                   3D tilt + glare on cards
      parallax.js               hero depth layers + sun rays
      hero-particles.js         WebGL golden dust over the hero
      pack3d.js                 interactive 3D pouch + orbiting beans

## Knobs
    tilt.js        MAX (degrees)               parallax.js   38 / 16 / .10 (mouse x / mouse y / scroll lag)
    hero-particles COUNT (110 / 40)            pack3d.js     N beans, bulge .34, camera distance
    effects.css    .rays alpha, .scene::after grain opacity

## Remove one effect
Delete its line in js/main.js. Nothing else depends on it.
