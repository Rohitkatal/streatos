// js/config.js - joins the files in /settings so the components read one object.
// DO NOT EDIT HERE. Change values in:  settings/site.js  |  settings/branches.js  |  settings/validation.js
import { SITE_SETTINGS } from '../settings/site.js';
import { LEGAL } from '../settings/legal.js';
import { BRANCHES } from '../settings/branches.js';

export const SITE = { ...SITE_SETTINGS, branches: BRANCHES, legal: LEGAL };
