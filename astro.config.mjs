// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  /* GitHub Pages servira projekat iz PODFOLDERA, pa `base` mora da se
     poklopi sa imenom repoa. Kad sajt pređe na pravi domen, `site` postaje
     taj domen, a `base` se briše — unutrašnje adrese idu kroz `put()` iz
     src/lib/putanja.ts, pa se ništa drugo ne menja. */
  site: 'https://ivankurtis18-alt.github.io',
  base: '/maxgym',
  image: {
    // Privremene fotografije sa Unsplash-a; zamenjuju se lokalnim fajlovima u src/assets.
    domains: ['images.unsplash.com'],
  },
  // Astro-va dev traka na dnu ekrana nije deo sajta, samo smeta pri pregledu
  devToolbar: { enabled: false },
  // Dev server ne sme da kešira — izmene se uvek vide odmah
  server: {
    headers: { 'Cache-Control': 'no-store' },
  },
});
