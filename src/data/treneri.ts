/**
 * Treneri personalnog treninga.
 *
 * PRIVREMENO: imena, opisi i fotografije čekaju podatke od klijenta.
 * Zamena je samo ovde (tekst) i u src/data/images.ts (portreti) —
 * raspored stranice se ne menja. Dok je site.prototype uključen,
 * uz imena stoji oznaka „privremeno".
 */
import type { ImageKey } from './images';

export interface Trainer {
  /** Redni broj na stranici — ostaje i kada stignu prava imena */
  no: string;
  name: string;
  /** Kratka uloga ispod imena */
  role: string;
  bio: string;
  /** Do tri oblasti rada; prazno dok ne stignu podaci */
  focus: string[];
  image: ImageKey;
}

export const trainers: Trainer[] = [
  {
    no: '01',
    name: 'Ime i prezime',
    role: 'Personalni trener',
    bio: 'Kratak opis trenera — pristup radu, oblasti u kojima najviše pomaže i ono po čemu ga klijenti prepoznaju.',
    focus: [],
    image: 'trainer01',
  },
  {
    no: '02',
    name: 'Ime i prezime',
    role: 'Personalna trenerka',
    bio: 'Kratak opis trenerke — pristup radu, oblasti u kojima najviše pomaže i ono po čemu je klijenti prepoznaju.',
    focus: [],
    image: 'trainer02',
  },
  {
    no: '03',
    name: 'Ime i prezime',
    role: 'Personalna trenerka',
    bio: 'Kratak opis trenerke — pristup radu, oblasti u kojima najviše pomaže i ono po čemu je klijenti prepoznaju.',
    focus: [],
    image: 'trainer03',
  },
  {
    no: '04',
    name: 'Ime i prezime',
    role: 'Personalni trener',
    bio: 'Kratak opis trenera — pristup radu, oblasti u kojima najviše pomaže i ono po čemu ga klijenti prepoznaju.',
    focus: [],
    image: 'trainer04',
  },
];
