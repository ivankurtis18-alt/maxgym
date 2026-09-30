/**
 * Centralni registar slika.
 *
 * Sve fotografije su PRIVREMENE (Unsplash) i služe samo za prototip.
 * Svaka slika na sajtu se poziva ključem iz ovog fajla, pa je zamena
 * pravim fotografijama iz sale izmena na jednom mestu:
 *
 *   import sala from '../assets/sala-glavna.jpg';
 *   gymFloor: { src: sala, alt: '…' },
 *
 * Lokalne slike automatski optimizuje astro:assets (vidi Media.astro).
 *
 * Tretman serije: sve slike su crno-bele sa punim crnim (global.css,
 * .media img), pa fotografije iz različitih izvora deluju kao jedna
 * kampanja. `tone` ujednačava svetlinu, `focus` drži subjekat u kadru
 * kada okvir menja razmeru između desktopa i telefona.
 * Pravilo izbora: bez logotipa drugih teretana, bez poziranja u
 * kameru, tamna scena sa kontrolisanim svetlima.
 */
import type { ImageMetadata } from 'astro';

export interface SiteImage {
  src: string | ImageMetadata;
  alt: string;
  /** Kadriranje na serveru (samo Unsplash): 'faces' drži lice u kadru */
  crop?: 'faces' | 'entropy';
  /** Tačka fokusa [x, y] od 0 do 1 — središte izreza na serveru i
   *  object-position za lokalne slike. Bez nje se kadrira po sredini. */
  focus?: [number, number];
  /** Korekcija svetline (1 = bez promene) — ujednačava seriju */
  tone?: number;
}

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const images = {
  // Hero
  heroLift: {
    src: unsplash('1745329532593-53a9ec306787'),
    alt: 'Vežbač podiže teg u polumračnoj sali',
    focus: [0.5, 0.35],
  },

  // Sala
  gymFloor: {
    src: unsplash('1778828494354-9b717d36dc99'),
    alt: 'Tamna sala sa spravama i tegovima',
  },
  // Ne iz istog snimanja kao hero — isti čovek dva puta zaredom bi se ponavljao
  gymWork: {
    src: unsplash('1674834727149-00812f907676'),
    alt: 'Vežbač uzima bučicu sa stalka',
    focus: [0.45, 0.5],
  },

  // Trening
  freeWeights: {
    src: unsplash('1734630341082-0fec0e10126c'),
    alt: 'Niz bučica poređanih na stalku',
  },
  machines: {
    src: unsplash('1637430308606-86576d8fef3c'),
    alt: 'Red sprava za trening snage u sali',
  },
  cardio: {
    src: unsplash('1685633224745-ebb90e6ae2fd'),
    alt: 'Niz sobnih bicikala u kardio zoni',
  },
  functional: {
    src: unsplash('1644085159448-1659fd88a217'),
    alt: 'Vežbač drži girju iznad glave',
  },
  personal: {
    src: unsplash('1738523686619-1b3b5d2405ee'),
    alt: 'Trener objašnjava vežbu vežbačici u sali',
  },

  // Zašto Max
  wideHall: {
    src: unsplash('1728486145245-d4cb0c9c3470'),
    alt: 'Prostrana sala puna sprava za trening',
  },

  // Galerija
  barbellGrip: {
    src: unsplash('1722925541142-5db2668ca492'),
    alt: 'Ruke čvrsto drže olimpijsku šipku',
    focus: [0.45, 0.4],
  },
  kettlebellWoman: {
    src: unsplash('1706029831387-fd8bc3d27d01'),
    alt: 'Vežbačica sa girjom u sali',
  },
  barRack: {
    src: unsplash('1722925541321-f52d45b29c17'),
    alt: 'Šipke na stalku u oštrom svetlu sale',
    focus: [0.5, 0.35],
  },
  kettlebellRow: {
    src: unsplash('1632077804406-188472f1a810'),
    alt: 'Girje poređane u nizu na podu sale',
  },
  darkHall: {
    src: unsplash('1778828450059-f39d5bbb01af'),
    alt: 'Sala sa spravama u večernjem svetlu',
  },
  barbellSetup: {
    src: unsplash('1526403223670-2aa44aaface2'),
    alt: 'Vežbač stoji ispred šipke pre serije',
  },

  // ---------------------------------------------------------------
  // Personalni trening — scene iz jednog snimanja (ista sala, isto svetlo)
  ptHero: {
    src: unsplash('1758875569256-f37c438cac65'),
    alt: 'Vežbačica diže tegove dok je trener pažljivo prati',
    focus: [0.5, 0.45],
    tone: 0.82,
  },
  ptPlan: {
    src: unsplash('1758875570137-8691b7c55033'),
    alt: 'Trener sa klijentkinjom prolazi kroz napredak na tabletu',
    crop: 'faces',
  },
  ptTalk: {
    src: unsplash('1758875569414-120ebc62ada3'),
    alt: 'Trener i klijentkinja dogovaraju plan treninga u sali',
    tone: 0.9,
  },

  // Treneri — PRIVREMENI portreti; zameniti pravim fotografijama
  // trenera (isti kadar: do struka, pogled u kameru, ista pozadina).
  trainer01: {
    src: unsplash('1758875568932-0eefd3e60090'),
    alt: 'Trener 01 — privremena fotografija',
    crop: 'faces',
    tone: 0.84,
  },
  trainer02: {
    src: unsplash('1758875569032-1fc6ac0158e6'),
    alt: 'Trenerka 02 — privremena fotografija',
    crop: 'faces',
    tone: 0.76,
  },
  trainer03: {
    src: unsplash('1685633224669-175193bd175b'),
    alt: 'Trenerka 03 — privremena fotografija',
    crop: 'faces',
    tone: 1.3,
  },
  trainer04: {
    src: unsplash('1645509563094-1febb5a6562b'),
    alt: 'Trener 04 — privremena fotografija',
    crop: 'faces',
    tone: 1.38,
  },
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;
