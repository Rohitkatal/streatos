// Entry point: each feature is its own component; one failing never breaks the rest.
import './components/site-ui.js';                       // your original menu / tabs / theme code
import { initProgress }       from './components/progress.js';
import { initReveal }         from './components/reveal.js';
import { initCounters }       from './components/counters.js';
import { initTilt }           from './components/tilt.js';
import { initParallax }       from './components/parallax.js';
import { initHeroParticles }  from './components/hero-particles.js';
import { initPack3D }         from './components/pack3d.js';
import { initLanguage }       from './components/language.js';
import { initNavSpy }         from './components/nav-spy.js';

const safe = (name, fn) => { try { fn(); } catch (e) { console.warn(`[${name}] failed:`, e); } };

safe('language',  initLanguage);          // header language dropdown
safe('navspy',    initNavSpy);            // active-section pill in the menu
safe('progress',  initProgress);
safe('parallax',  initParallax);
safe('pack3d',    initPack3D);           // lazy: loads Three.js when the section is near
safe('reveal',    initReveal);           // after pack3d so the 3D stage fades in too
safe('counters',  initCounters);
safe('tilt',      initTilt);
safe('particles', initHeroParticles);    // lazy: loads on idle
