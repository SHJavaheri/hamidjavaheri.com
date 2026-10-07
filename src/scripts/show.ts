import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { light } from './spotlight';
import { initHeroTransition, initHandoffs } from './transitions';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

/** Chapter counter, ticks, progress bar, and the stage gel. */
function initPresenter() {
  const root = document.documentElement;
  const chapters = $$<HTMLElement>('[data-chapter]');
  const counter = $('[data-counter]');
  const ticks = $$<HTMLAnchorElement>('[data-tick]');
  const progress = $('[data-progress]');
  const total = String(chapters.length - 1).padStart(2, '0');
  let current = '';

  const set = (el: HTMLElement) => {
    const id = el.dataset.chapter!;
    if (id === current) return;
    current = id;
    root.dataset.gel = el.dataset.gel || 'house';
    const i = chapters.indexOf(el);
    const name = el.querySelector('h1, h2')?.textContent?.replace(/\.$/, '') ?? '';
    if (counter) counter.innerHTML = i === 0 ? '<b>Opening</b>' : `Chapter <b>${String(i).padStart(2, '0')}</b> / ${total}<span class="nm"> · ${chapterName(el, name)}</span>`;
    ticks.forEach((t) => (t.dataset.tick === id ? t.setAttribute('aria-current', 'step') : t.removeAttribute('aria-current')));
  };
  const chapterName = (el: HTMLElement, fallback: string) =>
    ({ mashoorcake: 'MasHoorCake', firstline: 'FirstLine', podium: 'The podium', hublii: 'One more thing', 'in-development': 'In development', encore: 'Encore', backstage: 'Backstage', 'curtain-call': 'Curtain call' } as Record<string, string>)[el.dataset.chapter!] ?? fallback;

  chapters.forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && set(el) });
  });
  set(chapters[0]);
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (s) => { if (progress) progress.style.transform = `scaleX(${s.progress.toFixed(4)})`; },
  });
}

function intro() {
  gsap.from('[data-intro]', { opacity: 0, y: 26, filter: 'blur(6px)', duration: 1.1, stagger: 0.12, delay: 0.25, ease: 'expo.out', clearProps: 'filter' });
  // The photo fades in on its own; its frame belongs to the scroll transition, so the two never fight.
  gsap.from('[data-spot-anchor] img', { opacity: 0, scale: 0.92, duration: 1.3, ease: 'expo.out', clearProps: 'opacity,transform' });
}

function choreograph() {
  const reveal = (targets: gsap.TweenTarget, trigger: Element | string) =>
    gsap.from(targets, { y: 48, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger, start: 'top 68%', toggleActions: 'play none none reverse' } });

  // Opening: the name explodes and the camera pushes through the portrait into chapter one.
  initHeroTransition();

  // 01 · MasHoorCake: tiers drop in, the frosting cycles, then the whole site flips to Persian.
  reveal('#mashoorcake [data-build] > :not(h2)', '#mashoorcake');
  gsap.from('[data-mc-laptop]', { yPercent: 24, scale: 0.84, rotateX: 18, opacity: 0, transformPerspective: 1400, ease: 'none',
    scrollTrigger: { trigger: '#mashoorcake', start: 'top bottom', end: 'top top', scrub: true } });
  const frosts = ['#F6C9D0', '#FFF1D6', '#CFE3C4', '#D9C8F0'];
  const cake = $('[data-mc="en"] .cake');
  const sws = $$('[data-mc="en"] .sws .sw');
  const mc = gsap.timeline({ scrollTrigger: { trigger: '[data-pin="mc"]', start: 'top top', end: '+=190%', pin: true, scrub: 0.8 } });
  mc.from('[data-mc="en"] .t1', { y: -60, opacity: 0, duration: 0.3 })
    .from('[data-mc="en"] .t2', { y: -60, opacity: 0, duration: 0.3 })
    .from('[data-mc="en"] .t3', { y: -60, opacity: 0, duration: 0.3 })
    .from('[data-mc="en"] .topper', { y: -30, opacity: 0, duration: 0.25 })
    .to({}, { duration: 0.5, onUpdate() {
      const i = Math.min(3, Math.floor(this.progress() * 4));
      cake?.setAttribute('style', `--frost:${frosts[i]}`);
      sws.forEach((s, k) => s.classList.toggle('on', k === i));
    } })
    .from('[data-mc="en"] .toast', { y: 16, opacity: 0, duration: 0.25 })
    .to('[data-mc="en"]', { opacity: 0, duration: 0.35 }, '+=0.15')
    .to('[data-mc="fa"]', { opacity: 1, duration: 0.35 }, '<')
    .to({}, { duration: 0.3 });

  // Showreels drift sideways as they pass.
  $$('[data-reel]').forEach((reel) => {
    const track = $('.reel-track', reel);
    if (!track) return;
    gsap.fromTo(track, { x: () => innerWidth * 0.12 }, { x: () => -Math.max(0, track.scrollWidth - innerWidth) - innerWidth * 0.04, ease: 'none',
      scrollTrigger: { trigger: reel, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
  });

  // 02 · FirstLine: the phone cycles directory → messages → feed with a live push.
  reveal('#firstline [data-build] > :not(h2)', '#firstline');
  gsap.set('[data-fl-phone] .s2, [data-fl-phone] .s3', { opacity: 0 });
  gsap.from('[data-fl-phone]', { yPercent: 40, rotate: -12, rotateY: -22, transformPerspective: 1200, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '#firstline', start: 'top bottom', end: 'top top', scrub: true } });
  const fl = gsap.timeline({ scrollTrigger: { trigger: '[data-pin="fl"]', start: 'top top', end: '+=190%', pin: true, scrub: 0.8 } });
  fl.from('#firstline .t1', { x: -40, opacity: 0, duration: 0.3 })
    .from('#firstline .t2', { x: 40, opacity: 0, duration: 0.3 }, '<')
    .to('[data-fl-phone] .s2', { opacity: 1, duration: 0.3 }, '+=0.4')
    .from('[data-fl-phone] .s2 .bub, [data-fl-phone] .s2 .typing', { y: 20, opacity: 0, stagger: 0.08, duration: 0.3 }, '<')
    .to('[data-fl-phone] .s3', { opacity: 1, duration: 0.3 }, '+=0.4')
    .from('[data-fl-phone] .s3 .push', { yPercent: -160, duration: 0.35 }, '<0.1')
    .to('[data-fl-phone]', { rotate: 4, duration: 0.6 }, 0.2)
    .to({}, { duration: 0.3 });

  // 02b · FirstLine, exploded: the pieces drop along their guides and click into place.
  const arch = gsap.timeline({ scrollTrigger: { trigger: '[data-pin="fl-arch"]', start: 'top top', end: '+=170%', pin: true, scrub: 0.9 } });
  arch.from('.arch-copy > :not(h3)', { y: 40, opacity: 0, stagger: 0.1, duration: 0.4 })
    .from('.p-base', { y: 80, opacity: 0, duration: 0.45, ease: 'power2.out' }, 0.1)
    .from('.p-web', { y: -160, opacity: 0, duration: 0.5, ease: 'back.out(1.6)' })
    .to({}, { duration: 0.3 }) // the phone tower arrives by handoff from the FirstLine phone
    .to('.guides', { opacity: 0, duration: 0.2 })
    .from('.p-bridge', { scaleX: 0, transformOrigin: '0% 50%', opacity: 0, duration: 0.45, ease: 'power3.out' })
    .from('#firstline .lab', { opacity: 0, x: -10, stagger: 0.1, duration: 0.3 })
    .to({}, { duration: 0.3 });

  // 03 · The podium rises, bronze, silver, then the mystery.
  const cap = $('[data-pod-cap]');
  const mystery = $('[data-mystery]');
  const pod = gsap.timeline({ scrollTrigger: { trigger: '[data-pin="podium"]', start: 'top top', end: '+=220%', pin: true, scrub: 1,
    onUpdate(s) { if (cap) cap.textContent = s.progress < 0.36 ? 'Bronze…' : s.progress < 0.6 ? 'Bronze. Silver…' : 'Bronze. Silver. And first place goes to…'; } } });
  pod.from('[data-pod-title]', { y: 40, opacity: 0, duration: 0.4 })
    .from('.p3 .block', { scaleY: 0, duration: 0.6, ease: 'power2.out' })
    .from('.p3 .crown', { y: 40, opacity: 0, scale: 0.8, duration: 0.35 })
    .from('.p2 .block', { scaleY: 0, duration: 0.6, ease: 'power2.out' })
    .from('.p2 .crown', { y: 40, opacity: 0, scale: 0.8, duration: 0.35 })
    .from('.p1 .block', { scaleY: 0, duration: 0.8, ease: 'power2.out' })
    .from('.p1 .crown', { y: 50, opacity: 0, scale: 0.7, duration: 0.4 })
    .to(mystery, { scale: 1.12, yoyo: true, repeat: 1, duration: 0.2 })
    .to({}, { duration: 0.3 });

  // 04 · One more thing… then hublii.
  gsap.set('[data-omt-reveal] > *', { opacity: 0, y: 30 });
  const omt = gsap.timeline({ scrollTrigger: { trigger: '[data-pin="omt"]', start: 'top top', end: '+=240%', pin: true, scrub: 1,
    onUpdate(s) {
      const done = s.progress > 0.45;
      mystery?.classList.toggle('revealed', done);
      const nm = $('[data-p1-name]'); if (nm) nm.textContent = done ? 'hublii' : 'Under wraps';
    } } });
  omt.from('[data-omt-line] span', { opacity: 0, y: 26, filter: 'blur(8px)', stagger: 0.25, duration: 0.4 })
    .to({}, { duration: 0.5 })
    .to('[data-omt-line]', { scale: 0.82, opacity: 0, filter: 'blur(10px)', duration: 0.5 })
    .to('[data-omt-reveal] .wordmark', { opacity: 1, y: 0, duration: 0.01 }, '<')
    .fromTo('[data-omt-reveal] .wordmark', { scale: 1.3, filter: 'blur(14px)' }, { scale: 1, filter: 'blur(0px)', duration: 0.8 }, '<')
    .to(light, { boost: 1, duration: 0.6 }, '<')
    .to('[data-omt-reveal] > :not(.wordmark)', { opacity: 1, y: 0, stagger: 0.12, duration: 0.4 })
    .to({}, { duration: 0.4 })
    .to(light, { boost: 0, duration: 0.4 });

  // 04b · The tour: four questions, four screens.
  const qs = $$('.qs li'), shots = $$('.tour-shot');
  gsap.from('.hub-laptop', { yPercent: 16, scale: 0.9, rotateX: 14, transformPerspective: 1600, opacity: 0.2, ease: 'none',
    scrollTrigger: { trigger: '[data-pin="tour"]', start: 'top bottom', end: 'top top', scrub: true } });
  let shown = 0;
  ScrollTrigger.create({ trigger: '[data-pin="tour"]', start: 'top top', end: `+=${shots.length * 70}%`, pin: true, scrub: true,
    onUpdate(s) {
      const i = Math.min(shots.length - 1, Math.floor(s.progress * shots.length * 0.999));
      if (i === shown) return;
      gsap.to(shots[shown], { opacity: 0, duration: 0.5, ease: 'power2.out' });
      gsap.fromTo(shots[i], { opacity: 0, scale: 1.02 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' });
      qs.forEach((q, k) => q.classList.toggle('on', k === i));
      shown = i;
    } });

  // Features and slides land as they arrive.
  $$('.rv').filter((el) => !el.matches('h2, h3')).forEach((el) => gsap.from(el, { y: 56, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 86%' } }));

  // 04c · The stack: exploded, then pressed together like the logo.
  const layers = $$<SVGGElement>('[data-layer]');
  const st = gsap.timeline({ scrollTrigger: { trigger: '[data-pin="stack"]', start: 'top top', end: '+=160%', pin: true, scrub: 0.9 } });
  st.from('.stack-copy > :not(h3)', { y: 40, opacity: 0, stagger: 0.1, duration: 0.4 }, 0);
  layers.forEach((g) => {
    const lv = Number(g.dataset.layer);
    st.from(g, { y: -70 - lv * 46, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.15 + (3 - lv) * 0.12);
  });
  st.to({}, { duration: 0.4 });

  // The numbers count up as you read them.
  $$('[data-numbers] .n').forEach((n) => {
    const to = Number(n.dataset.to), suf = n.dataset.suf || '';
    const o = { v: 0 };
    gsap.to(o, { v: to, ease: 'none', scrollTrigger: { trigger: '[data-numbers]', start: 'top 85%', end: 'top 30%', scrub: 0.6 },
      onUpdate() { n.textContent = Math.round(o.v).toLocaleString('en-US') + suf; } });
  });
  gsap.from('[data-numbers] .w', { opacity: 0.12, stagger: 0.2, ease: 'none', scrollTrigger: { trigger: '[data-numbers]', start: 'top 80%', end: 'bottom 50%', scrub: true } });
  gsap.to('[data-yumi]', { y: -12, rotate: -3, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  // 05 · Pawmetric's phone slides up into its card.
  gsap.from('[data-paw-phone]', { y: 120, rotate: 4, ease: 'none', scrollTrigger: { trigger: '[data-paw-phone]', start: 'top bottom', end: 'center 55%', scrub: true } });

  // 06 · Encore: Bethesda, screen by screen.
  const frames = $$('.frame'), beats = $$('.beats li');
  let fShown = 0;
  ScrollTrigger.create({ trigger: '[data-pin="encore"]', start: 'top top', end: `+=${frames.length * 60}%`, pin: true, scrub: true,
    onUpdate(s) {
      const i = Math.min(frames.length - 1, Math.floor(s.progress * frames.length * 0.999));
      if (i === fShown) return;
      gsap.to(frames[fShown], { opacity: 0, duration: 0.5 });
      gsap.fromTo(frames[i], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' });
      beats.forEach((b, k) => b.classList.toggle('on', k === i));
      fShown = i;
    } });
  reveal('#encore .copy > *', '#encore');

  // 07 · The long goal, read off the teleprompter word by word.
  const q = $('[data-longgoal]');
  if (q) {
    q.innerHTML = (q.textContent ?? '').split(' ').map((w) => `<span class="w">${w}</span>`).join(' ');
    gsap.to('[data-longgoal] .w', { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: q, start: 'top 85%', end: 'bottom 45%', scrub: true } });
  }

  // 08 · Curtain call: the curtains part, the light opens up.
  gsap.fromTo('[data-curtains] i:first-child', { xPercent: 0 }, { xPercent: -100, ease: 'none', scrollTrigger: { trigger: '#curtain-call', start: 'top 85%', end: 'top 15%', scrub: true } });
  gsap.fromTo('[data-curtains] i:last-child', { xPercent: 0 }, { xPercent: 100, ease: 'none', scrollTrigger: { trigger: '#curtain-call', start: 'top 85%', end: 'top 15%', scrub: true } });
  gsap.to(light, { cboost: 0.6, ease: 'none', scrollTrigger: { trigger: '#curtain-call', start: 'top 60%', end: 'top top', scrub: true } });

  // Shared-element handoffs and word reveals, created after every pin so their positions are right.
  initHandoffs();
}

/** Without motion: every slide shows its finished state. */
function settle() {
  $('[data-mc="fa"]')?.removeAttribute('style');
  gsap.set('[data-fl-phone] .s2, [data-fl-phone] .s3', { opacity: 0 });
  gsap.set('[data-omt-line]', { display: 'none' });
  gsap.set('[data-omt-glow]', { opacity: 1 });
  $('[data-mystery]')?.classList.add('revealed');
  const nm = $('[data-p1-name]'); if (nm) nm.textContent = 'hublii';
  gsap.set('[data-curtains]', { display: 'none' });
  $$('.qs li, .beats li').forEach((li) => li.classList.add('on'));
}

/** Back to the opening: rewind the whole show, slow enough to watch it play backwards. */
function initRewind() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  $$<HTMLAnchorElement>('[data-rewind]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (reduce.matches) { scrollTo(0, 0); return; }
      const dist = scrollY;
      const duration = Math.min(5.5, Math.max(1.6, dist / 7000)); // ~4s for the full show
      gsap.to(window, { scrollTo: { y: 0, autoKill: true }, duration, ease: 'power2.inOut',
        onComplete: () => { document.getElementById('opening')?.focus({ preventScroll: true }); } });
    }));
}

export function initShow() {
  initRewind();
  const mm = gsap.matchMedia();
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', wide: '(min-width: 901px)' }, (ctx) => {
    const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean };
    if (!motion) { settle(); return; }
    intro();
    if (wide) choreograph();
    else choreographNarrow();
  });
  // Created after the pins so its start/end positions include the pin spacing.
  initPresenter();
  addEventListener('load', () => ScrollTrigger.refresh());
}

/** Phones: no pinning; each piece simply builds as it arrives. */
function choreographNarrow() {
  $$('.rv, [data-build] > *, .arch-copy > *, .stack-copy > *').forEach((el) =>
    gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));
  gsap.set('[data-fl-phone] .s2, [data-fl-phone] .s3', { opacity: 0 });
  gsap.from('.p-base, .p-web, .p-app, .p-bridge', { y: -50, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.iso-fig', start: 'top 80%' } });
  gsap.from('[data-layer]', { y: -40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '[data-pin="stack"] .iso-fig', start: 'top 80%' } });
  gsap.set('[data-omt-line]', { display: 'none' });
  gsap.set('[data-omt-glow]', { opacity: 1 });
  gsap.from('[data-omt-reveal] > *', { y: 30, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '[data-pin="omt"]', start: 'top 70%' } });
  $('[data-mystery]')?.classList.add('revealed');
  const nm = $('[data-p1-name]'); if (nm) nm.textContent = 'hublii';
  $$('.qs li, .beats li').forEach((li) => li.classList.add('on'));
  $$('.tour-shot').forEach((s, i) => gsap.set(s, { opacity: i === 0 ? 1 : 0 }));
  gsap.from('.pod .block', { scaleY: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out', transformOrigin: '50% 100%', scrollTrigger: { trigger: '.pod', start: 'top 75%' } });
  gsap.set('[data-curtains]', { display: 'none' });
  const q = $('[data-longgoal]');
  if (q) { q.innerHTML = (q.textContent ?? '').split(' ').map((w) => `<span class="w">${w}</span>`).join(' ');
    gsap.to('[data-longgoal] .w', { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: q, start: 'top 85%', end: 'bottom 50%', scrub: true } }); }
}
