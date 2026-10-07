// Entry point. Every feature is a small, separate component; one failing never breaks the others.
import { initTheme }      from './components/theme.js';
import { initNav }        from './components/nav.js';
import { initSiteConfig } from './components/site-config.js';
import { initLanguage }   from './components/language.js';
import { initValidation } from './components/validate.js';
import { initForms }      from './components/forms.js';
import { initBranches }   from './components/branches.js';
import { initTeam }       from './components/team.js';

const safe = (name, fn) => { try { fn(); } catch (e) { console.warn(`[${name}] failed:`, e); } };

safe('theme',    initTheme);
safe('nav',      initNav);
safe('config',   initSiteConfig);
safe('language', initLanguage);
safe('validate', initValidation);   // before forms, so bad values block the submit
safe('forms',    initForms);
safe('branches', initBranches);
safe('team',     initTeam);
