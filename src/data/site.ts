/**
 * Podaci o teretani — jedino mesto za kontakt, adresu i navigaciju.
 *
 * PROTOTIP: broj telefona je privremen i izmišljen. Dok je `prototype`
 * uključen, sajt pored broja i u galeriji prikazuje oznaku „privremeno",
 * da bi na prezentaciji klijentu bilo jasno šta se menja.
 * Kada stignu pravi podaci: upiši ih ovde i postavi `prototype: false`.
 */
export const site = {
  prototype: true,

  name: 'Max Gym & Fitness',
  short: 'Max Gym',

  phone: {
    display: '+381 11 555 0188',
    href: 'tel:+381115550188',
  },

  address: {
    street: 'Julije Delere 43',
    postalCode: '11211',
    city: 'Beograd',
    district: 'Borča',
    country: 'Srbija',
  },

  hours: [
    { days: 'Ponedeljak – petak', short: 'Pon–pet', time: '08–23 h', opens: '08:00', closes: '23:00', spec: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { days: 'Subota', short: 'Sub', time: '08–22 h', opens: '08:00', closes: '22:00', spec: ['Saturday'] },
    { days: 'Nedelja', short: 'Ned', time: '10–18 h', opens: '10:00', closes: '18:00', spec: ['Sunday'] },
  ],
  lastEntry: 'Poslednji dolazak je moguć 30 minuta pre zatvaranja.',

  maps: {
    link: 'https://www.google.com/maps/search/?api=1&query=Julije+Delere+43,+11211+Beograd',
    embed: 'https://www.google.com/maps?q=Julije+Delere+43,+11211+Beograd&z=16&output=embed',
  },
} as const;

/** Cenovnik — iznosi u dinarima. Porodični popust važi za sve pakete. */
export const pricing = {
  packages: [
    { name: 'Neograničeno', note: 'Mesečna članarina — dolaziš kad god želiš, u okviru radnog vremena.', price: 3200 },
    { name: '16 termina', note: 'Mesečna članarina sa 16 dolazaka.', price: 3000 },
    { name: '12 termina', note: 'Mesečna članarina sa 12 dolazaka.', price: 2800 },
    { name: '3 meseca unapred', note: 'Članarina za tri meseca, plaćena odjednom.', price: 8000 },
  ],
  familyDiscount: 200,
};

export const dinars = (n: number) => n.toLocaleString('sr-RS');

// Sekcije početne se navode kao "/#id" — rade i sa podstranica,
// a na samoj početnoj samo skroluju (bez ponovnog učitavanja).
export const nav = [
  { href: '/#sala', label: 'Sala' },
  { href: '/#trening', label: 'Trening' },
  { href: '/personalni-trening', label: 'Personalni trening' },
  { href: '/#clanarina', label: 'Članarina' },
  { href: '/#kontakt', label: 'Kontakt' },
] as const;
