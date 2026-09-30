/**
 * Unutrašnja adresa sa `base` prefiksom iz astro.config.mjs.
 * Na GitHub Pages sajt živi u podfolderu (/maxgym), pa '/#kontakt'
 * mora da postane '/maxgym/#kontakt'. Na pravom domenu (bez `base`)
 * adrese ostaju iste — ništa drugo se ne menja.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export const put = (path: string) => `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
