/**
 * Seamless chapter-to-chapter transitions (wide screens with motion only).
 * Purpose: spatial consistency. Each chapter hands something to the next,
 * so the show reads as one continuous take instead of a stack of sections.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = gsap.parseEase('power3.inOut');

type Box = { top: number; right: number; bottom: number; left: number; r: number };
const boxOf = (el: Element, radius: number): Box => {
  const b = el.getBoundingClientRect();
  return { top: b.top, right: innerWidth - b.right, bottom: innerHeight - b.bottom, left: b.left, r: radius };
};
const FULL: () => Box = () => ({ top: 0, right: 0, bottom: 0, left: 0, r: 0 });

/**
 * A shared-element handoff: one fixed layer clipped to `from`'s live rect,
 * travelling to `to`'s live rect as the visitor scrolls through [start, end].
 */
function handoff(opts: {
  layer: HTMLElement;
  trigger: Element;
  start: string;
  end: string;
  from: () => Box;
  to: () => Box;
  colors: [string, string];
  fadeIn?: number; // progress at which the layer is fully visible
  fadeOutFrom?: number; // progress after which it fades away
  onDone?: (done: boolean) => void;
  onProgress?: (p: number) => void;
}) {
  const color = gsap.utils.interpolate(opts.colors[0], opts.colors[1]);
  const fi = opts.fadeIn ?? 0.08, fo = opts.fadeOutFrom ?? 0.92;
  ScrollTrigger.create({
    trigger: opts.trigger, start: opts.start, end: opts.end, scrub: true,
    onUpdate(s) {
      const p = s.progress, t = easeInOut(p);
      const a = opts.from(), b = opts.to();
      const top = lerp(a.top, b.top, t), right = lerp(a.right, b.right, t), bottom = lerp(a.bottom, b.bottom, t), left = lerp(a.left, b.left, t), r = lerp(a.r, b.r, t);
      opts.layer.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round ${r}px)`;
      opts.layer.style.background = color(t) as string;
      opts.layer.style.opacity = String(p < fi ? p / fi : p > fo ? Math.max(0, (1 - p) / (1 - fo)) : 1);
      opts.onDone?.(p >= 0.999);
      opts.onProgress?.(p);
    },
    onLeave: () => { opts.layer.style.opacity = '0'; opts.onDone?.(true); opts.onProgress?.(1); },
    onLeaveBack: () => { opts.layer.style.opacity = '0'; opts.onDone?.(false); opts.onProgress?.(0); },
  });
}

/** Wrap a heading's words in masks so they can rise into place. */
function splitWords(el: HTMLElement) {
  if (el.dataset.split) return;
  el.dataset.split = '1';
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        (n.textContent ?? '').split(/(\s+)/).forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.append(w); return; }
          const m = document.createElement('span'); m.className = 'wm';
          const i = document.createElement('span'); i.className = 'wi'; i.textContent = w;
          m.append(i); frag.append(m);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && (n as Element).tagName !== 'BR') walk(n);
    });
  };
  walk(el);
}

export function initHeroTransition() {
  // ---------- 1. Opening → MasHoorCake: the name explodes, the camera pushes through the portrait ----------
  const name = $('#opening-title');
  if (name && !name.dataset.split) {
    name.dataset.split = '1';
    name.setAttribute('aria-label', name.textContent?.trim() ?? '');
    const dot = name.querySelector('.dot');
    const text = (name.firstChild?.textContent ?? '').trim();
    name.innerHTML = '';
    Array.from(text).forEach((c) => {
      const s = document.createElement('span');
      s.className = 'ch'; s.setAttribute('aria-hidden', 'true');
      s.textContent = c === ' ' ? ' ' : c;
      name.append(s);
    });
    if (dot) name.append(dot);
  }
  const chars = $$('#opening-title .ch, #opening-title .dot');
  const portrait = $('[data-spot-anchor]');
  const iris = $('[data-iris]');
  const hero = gsap.timeline({ scrollTrigger: { trigger: '#opening .stage', start: 'top top', end: '+=110%', pin: true, scrub: 0.6 } });
  hero
    .to('.scrollcue', { opacity: 0, duration: 0.1 }, 0)
    .to(chars, {
      y: () => gsap.utils.random(-260, -90), x: () => gsap.utils.random(-60, 60), rotate: () => gsap.utils.random(-28, 28),
      opacity: 0, filter: 'blur(8px)', stagger: { each: 0.018, from: 'center' }, duration: 0.5, ease: 'power2.in',
    }, 0.05)
    .to('#opening [data-typewriter]', { y: 40, opacity: 0, filter: 'blur(6px)', duration: 0.35 }, 0.05)
    .to('#opening .runofshow li', { y: () => gsap.utils.random(40, 120), opacity: 0, stagger: { each: 0.02, from: 'edges' }, duration: 0.4 }, 0.05)
    .fromTo(portrait, { scale: 1, opacity: 1, filter: 'blur(0px)' }, { scale: 6, opacity: 0, filter: 'blur(10px)', duration: 0.85, ease: 'power2.in', immediateRender: false }, 0.15)
    .fromTo(iris, { clipPath: 'circle(0% at 50% 34%)', opacity: 1 }, { clipPath: 'circle(150% at 50% 34%)', duration: 0.75, ease: 'power2.in' }, 0.3)
    .to(iris, { opacity: 0, duration: 0.25 }, 0.95);
}

export function initHandoffs() {
  const layer = $('[data-handoff]');
  if (!layer) return;

  // ---------- 2. FirstLine phone → the phone tower in the exploded diagram ----------
  const phoneScr = $('[data-fl-phone] .scr');
  const tower = $('.p-app');
  if (phoneScr && tower) {
    gsap.set(tower, { opacity: 0 });
    handoff({
      layer, trigger: $('[data-pin="fl-arch"]')!, start: 'top bottom', end: 'top top',
      from: () => boxOf(phoneScr, 34), to: () => boxOf(tower, 6),
      colors: ['#f6f8fc', '#67d3e6'], fadeIn: 0.04, fadeOutFrom: 0.62,
      onProgress: (p) => gsap.set(tower, { opacity: gsap.utils.clamp(0, 1, (p - 0.55) / 0.35), scale: 0.92 + 0.08 * gsap.utils.clamp(0, 1, (p - 0.55) / 0.35), transformOrigin: '50% 100%' }),
    });
  }

  // ---------- 3. Podium → hublii: the gold block becomes the golden-hour sky ----------
  const gold = $('.p1 .block');
  if (gold) {
    const dark = () => document.documentElement.dataset.theme === 'dark';
    gsap.set('[data-omt-glow]', { opacity: 1 });
    handoff({
      layer, trigger: $('[data-pin="omt"]')!, start: 'top bottom', end: 'top top',
      from: () => boxOf(gold, 12), to: FULL,
      colors: ['#e2a62f', dark() ? '#1f2a2e' : '#f6e1c6'], fadeIn: 0.02, fadeOutFrom: 0.85,
    });
  }

  // ---------- 4. Headings rise word by word from behind a mask ----------
  $$<HTMLElement>('.chapter h2.h-l, .chapter h2.h-m, .chapter h3.h-l, .chapter h3.h-m').forEach((h) => {
    if (h.closest('[data-omt-reveal]') || h.id === 'opening-title') return;
    splitWords(h);
    gsap.from(h.querySelectorAll('.wi'), {
      yPercent: 110, rotate: 4, duration: 1.05, stagger: 0.045, ease: 'expo.out',
      scrollTrigger: { trigger: h, start: 'top 85%', toggleActions: 'play none none reverse' },
    });
  });

  // Screenshots in the reels drift at their own depth as they pass.
  $$('.shot').forEach((d) => {
    gsap.fromTo(d, { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: d, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}
