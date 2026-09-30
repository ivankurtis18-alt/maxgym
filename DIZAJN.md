# Max Gym & Fitness 2.0 — dizajn i predaja

Astro 5, bez UI biblioteka. `npm run dev` za razvoj, `npm run build` za produkciju (`dist/`).

## Ideja

**Naprezanje.** Displej pismo *Anybody* ima osu širine 50–150%. Naslovi su stisnuti (56%),
a jedna reč u svakom velikom naslovu (`<em>`) je razvučena — kao mišić pod opterećenjem.
Isti gest je i interakcija: dugmad, navigacija i redovi indeksa se na hover *šire*.
Hero otvara ogromnim punim MAX-om koji se preko fotografije nastavlja kao kontura;
podnožje zatvara istim MAX-om samo u obrisu.

## Sistem

| | |
|---|---|
| Boje | `--ink #0D0F0E`, `--chalk #EDEBF1`, `--volt #7B2CD4`. |
| Uloge ljubičaste | Samo četiri: znak (crta u logotipu) · primarno dugme · aktivno stanje (trenutna sekcija, aktivan red, fokus) · dva brend momenta — „ploče" u Prvom dolasku i puno polje Članarine. Nigde kao hover boja ili ukras. |
| Pisma | Anybody Variable (displej), Instrument Sans Variable (tekst). |
| Širine | Displej: `--w-tight` 56% naslovi · `--w-mid` 80% podnaslovi i broj telefona · 100% aktivno · `--w-wide` 150% razvučena reč. Tekst: `--w-cond` 75% za oznake, dugmad i navigaciju, 100% za čitanje. Druge vrednosti ne postoje. |
| Zaglavlje sekcije | `.eyebrow` — linija preko cele kolone i oznaka ispod. Svaka sekcija počinje njime; to je šav između sekcija. |
| Ritam | `--section` između sekcija, `--head-gap` od zaglavlja do sadržaja. |
| Slike | Crno-belo, pune crne, bez ukrasnih gradijenata (senka samo ispod naslova u traci „Zašto Max"). Razmere samo: `--r-poster` 2:3, `--r-portrait` 4:5, `--r-land` 3:2, `--r-wide` 21:9. |
| Oblici | Bez zaobljenja. Linije 1px. Hover = širenje, ne promena boje. |
| Pravilo za `<em>` | Razvučena reč je kratka (do ~6 slova), inače preliva kolonu. Na tabletu/telefonu se širina sama smanjuje. |

Tokeni: [src/styles/global.css](src/styles/global.css).

## Stranice

| Ruta | Sadržaj |
|---|---|
| `/` | Početna |
| `/personalni-trening` | Hero „1:1" (isti postupak slojeva kao MAX) → Pristup → Za koga → Proces → Treneri → završni poziv u podnožju |

Zajedničke komponente, da obe stranice govore istim jezikom: `Band` (traka sa fotografijom i velikim naslovom), `Steps` (koraci na šipci), `Footer` (završni poziv se podešava po stranici), `Header` (`current` označava podstranicu).

## Pokret

Kod: [src/scripts/motion.ts](src/scripts/motion.ts) (GSAP + ScrollTrigger). Tri gesta i ništa mimo njih:

| Gest | Gde |
|---|---|
| **Naprezanje** — širina se rasteže | MAX u heroju pri učitavanju, razvučena reč u svakom naslovu na ulasku, MAX u podnožju prati kraj stranice, hover na dugmadima/navigaciji/indeksu |
| **Podizanje** — maska odozdo | reči naslova, fotografije, „ploča" na dugmadima, smena fotografija u indeksu treninga |
| **Opterećenje** — napredak | šipka u Prvom dolasku se puni skrolom, ploče se natovare kad ih linija dosegne |

Indeks treninga: fotografija stoji u lepljivoj koloni i menja je red koji prolazi sredinom ekrana (ili hover/fokus); veličina naziva je vezana za kolonu da aktivna širina ne prelama red.

Kontinuitet: linije zaglavlja se iscrtavaju, hero se pri skrolu povlači u dubinu (MAX zaostaje, tekst odlazi), polje Članarine se širi do ivica, header se sklanja pri skrolu nadole.

Pravila: ulasci 0.9–1.4 s `expo.out`, stanja 0.45 s, mikro 0.25 s. Samo transform / opacity / clip-path / font-stretch. Paralaksa, dubina galerije i širenje Članarine samo na desktopu. Uz `prefers-reduced-motion` se ništa ne izvršava i sav sadržaj je odmah vidljiv. Ako skripta ne stigne, `<head>` posle 3,5 s ipak otkriva sadržaj.

## Telefon (≤ 560 px)

Nije umanjen desktop, nego ista ideja složena za uzan ekran:

- **Hero** — naslov u dva reda, razvučena reč ostaje na 150% (samo u herojima; drugde je `--w-wide` 100%), i zalazi preko tamnog dna fotografije kao što MAX zalazi preko njenog vrha. Prvo dugme je u prvom kadru od 390 px visine naviše.
- **Indeks treninga** — karte koje se prevlače (scroll-snap), sledeća viri; brojač i šipka napretka ispod.
- **Meni** — stavke izranjaju redom; aktivna sekcija je razvučena; sadržaj iza menija je `inert` dok je otvoren.
- **Treneri** — cik-cak sa pomakom od dve kolone. **Podnožje** — navigacija u dve kolone sa punom visinom za prst.
- `--section` je 4rem; `.link` na dodirnim ekranima ima veću površinu za prst.

## Šta se menja kada stignu pravi podaci

1. **Kontakt** — [src/data/site.ts](src/data/site.ts): telefon, radno vreme (`hours`), pa `prototype: false`
   (sklanja oznake „privremeno" i `noindex`, a uključuje `canonical` i `og:url`).
   Pre toga upisati pravi domen u `site` u [astro.config.mjs](astro.config.mjs) — sada je `maxgym.example`.
2. **Fotografije** — [src/data/images.ts](src/data/images.ts): trenutno privremene sa Unsplash-a.
   Prave fotografije staviti u `src/assets/` i uvesti ih umesto URL-a — optimizacija je automatska.
   Svaka slika se poziva ključem, pa se menja samo registar. `focus: [x, y]` (0–1) je tačka koju
   kadar čuva kada okvir menja razmeru; komponente kroz `ratio` i `art` (Media.astro) traže tačnu
   razmeru okvira za desktop, tablet i telefon, pa se slika nikad ne razvlači.
   Pravila izbora: bez logotipa drugih teretana, bez poziranja u kameru, tamna scena, kontrolisana svetla.
3. **Cene i radno vreme** — potvrđeni, u `pricing` i `hours` u [src/data/site.ts](src/data/site.ts). Personalni trening je i dalje „cena na upit".
4. **Treneri** — imena, uloge, opisi i oblasti rada u [src/data/treneri.ts](src/data/treneri.ts); portreti su
   ključevi `trainer01`–`trainer04` u `images.ts`. Za prave portrete: isti kadar za sve četiri osobe
   (do struka, pogled u kameru, ista pozadina). `crop: 'faces'` i `tone` ujednačavaju privremene fotografije
   i mogu se ukloniti kada stignu snimci iz jednog fotografisanja.
