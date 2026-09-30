/**
 * Sistem pokreta — MAX GYM & FITNESS
 * ---------------------------------------------------------------
 * Tri gesta, izvedena iz brenda. Ništa se ne pomera mimo njih.
 *
 *  1. NAPREZANJE  — razvučena reč (<em>) i reč MAX se rastežu
 *                   iz stisnute širine u punu.
 *  2. PODIZANJE   — reči naslova i fotografije izranjaju iz maske
 *                   odozdo, kao teg koji ide gore. Nema „fade" na
 *                   naslovima.
 *  3. OPTEREĆENJE — šipka u Prvom dolasku se puni dok skroluješ, a
 *                   ploče se „natovare" kada ih dosegne.
 *
 * Kontinuitet: linije zaglavlja se iscrtavaju, hero se pri skrolu
 * povlači u dubinu, polje Članarine se širi do ivica, a MAX u
 * podnožju se razvlači kako se stranica bliži kraju.
 *
 * Tempo: ulasci 0.9–1.4 s (expo.out), stanja 0.45 s, mikro 0.25 s.
 * Samo transform, opacity, clip-path i font-stretch na pojedinačnim
 * elementima. Uz prefers-reduced-motion se ništa od ovoga ne izvršava.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const EASE = 'expo.out';
const TIGHT = '56%'; // --w-tight

const root = document.documentElement;
const $ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = document) =>
  ctx.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = document) =>
  [...ctx.querySelectorAll<T>(sel)];

/* ---------------------------------------------------------------
   Deljenje naslova na reči u maskama.
   <em> ostaje jedna celina (da bi mogla da se razvuče), <strong>
   i ostali inline elementi se dele iznutra, .sr-only se preskače.
   --------------------------------------------------------------- */
function splitWords(el: HTMLElement) {
  const inners: HTMLElement[] = [];
  const ems: HTMLElement[] = [];

  const mask = (inner: HTMLElement) => {
    const w = document.createElement('span');
    w.className = 'w';
    inner.replaceWith(w);
    w.append(inner);
    inners.push(inner);
    return w;
  };

  const walk = (node: Node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        for (const part of parts) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.append(' ');
          } else {
            const w = document.createElement('span');
            w.className = 'w';
            const i = document.createElement('span');
            i.textContent = part;
            w.append(i);
            frag.append(w);
            inners.push(i);
          }
        }
        child.replaceWith(frag);
      } else if (child instanceof HTMLElement) {
        if (child.classList.contains('sr-only')) continue;
        if (child.tagName === 'EM') {
          mask(child);
          ems.push(child);
        } else {
          walk(child);
        }
      }
    }
  };

  walk(el);
  return { inners, ems };
}

/* Razvučena reč tokom animacije ne sme da menja prelom redova:
   maska dobija konačnu širinu dok traje rastezanje. */
function lockWidth(em: HTMLElement) {
  const w = em.parentElement as HTMLElement;
  w.style.width = `${w.getBoundingClientRect().width}px`;
  return () => (w.style.width = '');
}

function stretchIn(tl: gsap.core.Timeline, ems: HTMLElement[], at: number | string) {
  ems.forEach((em) => {
    const release = lockWidth(em);
    tl.from(
      em,
      { fontStretch: TIGHT, duration: 1.3, ease: EASE, clearProps: 'fontStretch', onComplete: release },
      at,
    );
  });
}

/* ---------------------------------------------------------------
   HERO — otvaranje kampanje
   --------------------------------------------------------------- */
function heroIntro() {
  const hero = $('[data-hero-root]');
  if (!hero) return;

  const maxLayers = $$('[data-hero="max"]', hero);
  const photo = $('[data-hero="photo"]', hero)!;
  const img = $('img', photo)!;
  const title = $('[data-hero="title"]', hero)!;
  const header = $('[data-header]');
  const { inners, ems } = splitWords(title);

  gsap.set(photo, { clipPath: 'inset(100% 0% 0% 0%)' });
  gsap.set(img, { scale: 1.32 });
  gsap.set(maxLayers, { fontStretch: '50%', autoAlpha: 0 });
  gsap.set(inners, { yPercent: 115 });
  gsap.set(['[data-hero="loc"]', '[data-hero="text"]'], { autoAlpha: 0, y: 18 });
  gsap.set('[data-hero="actions"] > *', { autoAlpha: 0, y: 18 });
  gsap.set(title, { autoAlpha: 1 });
  if (header) gsap.set(header, { autoAlpha: 0, y: -16 });

  const tl = gsap.timeline({ defaults: { ease: EASE } });
  tl.to(maxLayers, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 0)
    .to(maxLayers, { fontStretch: '150%', duration: 1.6, clearProps: 'fontStretch' }, 0)
    .to(photo, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4 }, 0.15)
    .to(img, { scale: 1.12, duration: 2.4 }, 0.15)
    .to('[data-hero="loc"]', { autoAlpha: 1, y: 0, duration: 0.9, clearProps: 'transform' }, 0.55)
    .to(inners, { yPercent: 0, duration: 1.1, stagger: 0.08 }, 0.6);
  stretchIn(tl, ems, 0.85);
  tl.to('[data-hero="text"]', { autoAlpha: 1, y: 0, duration: 1, clearProps: 'transform' }, 0.95)
    .to('[data-hero="actions"] > *', { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, clearProps: 'transform' }, 1.05);
  // transform na headeru bi zarobio fiksni mobilni meni — čistimo ga
  if (header) tl.to(header, { autoAlpha: 1, y: 0, duration: 0.9, clearProps: 'all' }, 1);
}

function heroScroll() {
  const hero = $('[data-hero-root]');
  if (!hero) return;
  const img = $('[data-hero="photo"] img', hero)!;

  // MAX zaostaje (dublji plan), fotografija klizi u okviru, tekst odlazi
  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    })
    .to('[data-hero="max"]', { yPercent: 38 }, 0)
    .to(img, { yPercent: 9 }, 0)
    .to('[data-hero-copy]', { y: -48, autoAlpha: 0.15 }, 0);
}

/* ---------------------------------------------------------------
   SKROL — ulasci
   --------------------------------------------------------------- */
function eyebrows() {
  $$('.eyebrow').forEach((el) => {
    gsap.set(el, { '--draw': 0, autoAlpha: 0 });
    gsap.to(el, {
      '--draw': 1,
      autoAlpha: 1,
      duration: 1.2,
      ease: 'expo.inOut',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

function headings() {
  $$('[data-split]').forEach((el) => {
    const isText = el.dataset.split === 'text';
    const { inners, ems } = splitWords(el);
    gsap.set(inners, { yPercent: 115 });
    gsap.set(el, { autoAlpha: 1 });

    const tl = gsap.timeline({
      defaults: { ease: EASE },
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    });
    tl.to(inners, {
      yPercent: 0,
      duration: isText ? 0.9 : 1.1,
      stagger: isText ? 0.012 : 0.07,
    });
    stretchIn(tl, ems, 0.25);
  });
}

function blocks() {
  const all = $$('[data-reveal]');
  const fades = all.filter((el) => el.dataset.reveal === 'fade');
  const lifts = all.filter((el) => el.dataset.reveal !== 'fade');

  // Samo opacity, ne autoAlpha: blokovi nose linkove i dugmad, a
  // element sa visibility:hidden ne može da primi fokus — Tab bi
  // preskočio sav sadržaj koji još nije ušao. Fokus pomera skrol do
  // elementa, pa se ulazak okine sam.
  // Stranica ne mora imati obe vrste (personalni trening nema „fade").
  if (lifts.length) {
    gsap.set(lifts, { opacity: 0, y: 28 });
    ScrollTrigger.batch(lifts, {
      start: 'top 90%',
      once: true,
      onEnter: (els) =>
        gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.08, clearProps: 'transform' }),
    });
  }
  if (fades.length) {
    gsap.set(fades, { opacity: 0 });
    ScrollTrigger.batch(fades, {
      start: 'top 92%',
      once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.07 }),
    });
  }
}

function images() {
  $$('[data-img]').forEach((fig) => {
    const img = $('img', fig);
    if (!img) return;
    gsap.set(fig, { clipPath: 'inset(100% 0% 0% 0%)', autoAlpha: 1 });
    gsap.set(img, { scale: 1.2 });
    gsap
      .timeline({ defaults: { ease: EASE }, scrollTrigger: { trigger: fig, start: 'top 88%', once: true } })
      .to(fig, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3 })
      .to(img, { scale: 1, duration: 1.8 }, 0);
  });
}

/* Paralaksa unutar okvira. Rezerva za pomak ide preko CSS `scale`
   (klasa .is-deep), odvojeno od transform-a koji koristi ulazak. */
function imageParallax() {
  const figs = $$('[data-img="parallax"]');
  figs.forEach((fig) => {
    fig.classList.add('is-deep');
    gsap.fromTo(
      $('img', fig),
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
  return () => figs.forEach((fig) => fig.classList.remove('is-deep'));
}

/* ---------------------------------------------------------------
   SKROL — dubina i kontinuitet (samo desktop)
   --------------------------------------------------------------- */
function bands() {
  $$('[data-band]').forEach((fig) => {
    const img = $('img', fig)!;
    const title = $('[data-band-title]', fig.parentElement!);
    gsap.set(img, { scale: 1.18 });
    const st = { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true };
    gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: st });
    // Naslov trake blago klizi ulevo — jedino horizontalno kretanje
    if (title) gsap.fromTo(title, { xPercent: 2 }, { xPercent: -3, ease: 'none', scrollTrigger: st });
  });
}

/* Slojevi različite dubine (galerija, treneri): data-speed */
function depth() {
  $$('[data-speed]').forEach((item) => {
    const speed = parseFloat(item.dataset.speed ?? '0');
    if (!speed) return;
    gsap.fromTo(
      item,
      { y: () => -speed * window.innerHeight * 0.5 },
      {
        y: () => speed * window.innerHeight * 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  });
}

function fields() {
  // Ljubičasto polje se širi do ivica kako ulazi — prelaz, ne rez
  $$('[data-field]').forEach((el) =>
    gsap.fromTo(
      el,
      { clipPath: 'inset(6% 3.5% 0% 3.5%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 20%', scrub: true },
      },
    ),
  );
}

/* NAPREZANJE vezano za skrol: razvučena reč u redu se rasteže dok
   red prolazi kroz sredinu ekrana, a red prelazi iz utišanog u pun. */
function tension() {
  $$('[data-tension]').forEach((row) => {
    const em = $('em', row);
    const title = $('[data-tension-title]', row) ?? row;
    const st = { trigger: row, start: 'top 88%', end: 'top 42%', scrub: 0.4 };
    if (em) gsap.fromTo(em, { fontStretch: TIGHT }, { fontStretch: '150%', ease: 'none', scrollTrigger: st });
    gsap.fromTo(title, { color: 'rgb(139 137 148)' }, { color: 'rgb(237 235 241)', ease: 'none', scrollTrigger: st });
  });
}

/* NAPREZANJE na ulasku, jednokratno (npr. brojevi trenera) */
function stretchers() {
  $$('[data-stretch-in]').forEach((el) => {
    gsap.from(el, {
      fontStretch: TIGHT,
      duration: 1.4,
      ease: EASE,
      clearProps: 'fontStretch',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

function footerMax() {
  const el = $('[data-ftr-max]');
  if (!el) return;
  // Završnica: MAX se razvlači kako se stranica bliži kraju
  gsap.fromTo(
    el,
    { fontStretch: '62%' },
    {
      fontStretch: '150%',
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
    },
  );
}

/* ---------------------------------------------------------------
   OPTEREĆENJE — šipka i ploče
   --------------------------------------------------------------- */
function steps(axis: 'x' | 'y' | null) {
  const cleanups = $$('[data-steps]').map((list) => loadBar(list, axis));
  return () => cleanups.forEach((fn) => fn());
}

function loadBar(list: HTMLElement, axis: 'x' | 'y' | null) {
  const items = $$('.step', list);
  list.classList.add('is-live');

  // Tablet: nema šipke — svaka ploča se natovari kad uđe u kadar
  if (!axis) {
    items.forEach((it) =>
      ScrollTrigger.create({ trigger: it, start: 'top 80%', once: true, onEnter: () => it.classList.add('is-loaded') }),
    );
    return () => list.classList.remove('is-live');
  }

  // Pragovi: položaj svake ploče duž šipke (0–1)
  let thresholds: number[] = [];
  const measure = () => {
    const len = axis === 'x' ? list.offsetWidth : list.offsetHeight;
    thresholds = items.map((it) => ((axis === 'x' ? it.offsetLeft : it.offsetTop) + 6) / len);
  };

  gsap.set(list, { '--fill': 0 });
  // Ploča se puni kada je linija vizuelno dosegne — prati se progres
  // same animacije (sa scrub zaostatkom), ne položaj skrola.
  const tween = gsap.to(list, {
    '--fill': 1,
    ease: 'none',
    onUpdate() {
      const p = this.progress();
      items.forEach((it, i) => it.classList.toggle('is-loaded', p >= thresholds[i]));
    },
    scrollTrigger: {
      trigger: list,
      start: 'top 78%',
      end: axis === 'x' ? 'bottom 50%' : 'bottom 65%',
      scrub: 0.5,
      onRefresh: measure,
    },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    list.classList.remove('is-live');
    items.forEach((it) => it.classList.remove('is-loaded'));
    list.style.removeProperty('--fill');
  };
}

/* ---------------------------------------------------------------
   Pokretanje
   --------------------------------------------------------------- */
function init() {
  if (root.classList.contains('motion-built')) return;
  root.classList.add('motion-built');

  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    // Jednokratni ulasci — van matchMedia, da ih promena širine ne poništi
    heroIntro();
    eyebrows();
    headings();
    blocks();
    images();
    stretchers();
  }

  // Pokret vezan za skrol — zavisi od širine, pa se gradi po uslovima
  gsap.matchMedia().add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 961px)',
      mobile: '(max-width: 560px)',
    },
    (ctx) => {
      const { motion, desktop, mobile } = ctx.conditions as Record<string, boolean>;
      if (!motion) return;

      heroScroll();
      const cleanups = [steps(desktop ? 'x' : mobile ? 'y' : null)];

      if (desktop) {
        cleanups.push(imageParallax());
        bands();
        depth();
        fields();
      }
      if (!mobile) {
        footerMax();
        tension();
      }

      return () => cleanups.forEach((fn) => fn?.());
    },
  );

  root.classList.add('motion-ready');
}

// Razvučene reči se mere — zato se čeka da fontovi stignu (najduže 1.2 s)
// Ako je stranica otvorena već skrolovana (link na #sekciju), okidači se
// grade od vrha, pa se vraća na istu poziciju — tako se svi ulasci
// iznad i u kadru sigurno izvrše, umesto da ostanu sakriveni.
// Dolazak sa druge stranice na #sekciju: pregledač do tada možda još
// klizi ka njoj (scroll-behavior: smooth), pa se cilj traži po id-ju,
// a ne po trenutnoj poziciji skrola.
Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1200))]).then(() => {
  const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
  const y = window.scrollY;
  if (y) window.scrollTo({ top: 0, behavior: 'instant' });
  init();
  ScrollTrigger.refresh();
  if (target) target.scrollIntoView({ behavior: 'instant' });
  else if (y) window.scrollTo({ top: y, behavior: 'instant' });
});
