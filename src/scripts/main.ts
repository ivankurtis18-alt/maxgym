/**
 * Ponašanje stranice. Sve je progresivno poboljšanje — sadržaj je
 * potpun i bez JavaScript-a.
 */

import './motion';

/* ---------- Rezervisana širina za hover-razvlačenje ---------- */
document.querySelectorAll<HTMLElement>('.btn > span, .kontakt__number').forEach((el) => {
  el.dataset.stretch = el.textContent?.trim() ?? '';
});

/* ---------- Header: podloga pri skrolu, sklanja se nadole ----------
   Skrol nadole sklanja traku (više prostora za sadržaj), skrol
   nagore je vraća. Jedan rAF po frejmu, bez merenja rasporeda. */
const header = document.querySelector<HTMLElement>('[data-header]');

if (header) {
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const open = header.classList.contains('is-open');
    const focused = header.contains(document.activeElement);
    header.classList.toggle('is-scrolled', y > 24);
    if (!open && !focused && y > 480 && y > lastY + 4) header.classList.add('is-hidden');
    else if (y < lastY - 4 || y <= 480) header.classList.remove('is-hidden');
    lastY = y;
    ticking = false;
  };

  update();
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
}

/* ---------- Povratak na vrh: vidljiv kada hero izađe iz kadra ---------- */
const toTop = document.querySelector<HTMLElement>('[data-totop]');
const heroForTop = document.querySelector<HTMLElement>('[data-hero-root]');

if (toTop && heroForTop) {
  new IntersectionObserver(([entry]) => toTop.classList.toggle('is-visible', !entry.isIntersecting)).observe(
    heroForTop,
  );
}

/* ---------- Mobilni meni ---------- */
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const menuLabel = document.querySelector<HTMLElement>('[data-menu-label]');

if (header && toggle && menu) {
  // Dok je meni otvoren, sadržaj iza njega nije dostupan fokusu ni čitaču
  const behind = document.querySelectorAll<HTMLElement>('main, footer, .skip-link, [data-totop]');
  const setOpen = (open: boolean) => {
    header.classList.toggle('is-open', open);
    behind.forEach((el) => (el.inert = open));
    toggle.setAttribute('aria-expanded', String(open));
    if (menuLabel) menuLabel.textContent = open ? 'Zatvori' : 'Meni';
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}

/* ---------- Aktivna stavka navigacije ----------
   Samo za linkove ka sekcijama koje postoje na ovoj stranici.
   Link ka trenutnoj podstranici (aria-current) se ne dira. Povratak
   na hero briše oznaku — na vrhu stranice nijedna sekcija nije aktivna. */
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('.hdr__link')].filter(
  (a) => a.hash && a.pathname === location.pathname && document.querySelector(a.hash),
);
const sections = navLinks.map((a) => document.querySelector<HTMLElement>(a.hash)!);
const heroRoot = document.querySelector<HTMLElement>('[data-hero-root]');

if (sections.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = entry.target === heroRoot ? '' : `#${entry.target.id}`;
        navLinks.forEach((a) => a.classList.toggle('is-current', a.hash === id));
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => spy.observe(s));
  if (heroRoot) spy.observe(heroRoot);
}

/* ---------- Indeks treninga ----------
   Aktivan red bira fotografiju u lepljivoj koloni (desktop). Red se
   aktivira hoverom, fokusom ili kada na desktopu prođe sredinom
   ekrana — pa se kolona menja i dok se samo skroluje. */
const desktop = window.matchMedia('(min-width: 961px)');

document.querySelectorAll<HTMLElement>('[data-index]').forEach((index) => {
  const rows = [...index.querySelectorAll<HTMLElement>('[data-index-row]')];
  const shots = [...index.querySelectorAll<HTMLElement>('[data-index-shot]')];
  let timer = 0;

  const activate = (row: HTMLElement) => {
    const i = rows.indexOf(row);
    const prev = rows.findIndex((r) => r.classList.contains('is-active'));
    if (prev === i) return;
    rows.forEach((r, k) => r.classList.toggle('is-active', k === i));
    // prethodna fotografija ostaje ispod dok nova ne prekrije okvir
    shots.forEach((s, k) => {
      s.classList.toggle('was-active', k === prev);
      s.classList.toggle('is-active', k === i);
    });
    clearTimeout(timer);
    timer = window.setTimeout(() => shots[prev]?.classList.remove('was-active'), 800);
  };

  rows.forEach((row) => {
    row.addEventListener('pointerenter', () => activate(row));
    row.addEventListener('focusin', () => activate(row));
  });

  const line = new IntersectionObserver(
    (entries) => {
      if (!desktop.matches) return;
      for (const entry of entries) if (entry.isIntersecting) activate(entry.target as HTMLElement);
    },
    { rootMargin: '-49.5% 0px -50% 0px' },
  );
  rows.forEach((row) => line.observe(row));

  // Telefon: karte se prevlače — šipka i brojač prate položaj
  const list = index.querySelector<HTMLElement>('.idx__list');
  const progress = index.querySelector<HTMLElement>('[data-index-progress]');
  const count = index.querySelector<HTMLElement>('[data-index-count]');
  if (list && progress && count) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = list.scrollWidth - list.clientWidth;
      if (max <= 0) return;
      const p = list.scrollLeft / max;
      const step = Math.round(p * (rows.length - 1));
      const first = 1 / rows.length;
      progress.style.setProperty('--p', String(first + p * (1 - first)));
      count.textContent = String(step + 1).padStart(2, '0');
    };
    // Smernica „Prevuci" nestaje posle prvog prevlačenja; jednokratni
    // mig karata kada spisak uđe u kadar (samo kada se zaista prevlači)
    const swiped = () => progress.classList.add('is-swiped');
    const nudge = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        nudge.disconnect();
        const scrollable = list.scrollWidth > list.clientWidth + 1;
        if (scrollable && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
          list.classList.add('is-nudge');
        }
      },
      { threshold: 0.6 },
    );
    nudge.observe(list);

    list.addEventListener(
      'scroll',
      () => {
        if (list.scrollLeft > 8) swiped();
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
  }
});
