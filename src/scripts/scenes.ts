/**
 * Scenes: the show moves in takes, not pixels.
 * A small scroll only leans the stage a little. Push past the threshold and it lets go,
 * gliding to the next resting point, playing any pinned scene on the way.
 * Wheel, touch and keyboard all go through the same director. Reduced motion keeps native scroll.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Where each pinned scene rests, as fractions of its pin. 'steps' rests once per screen. */
const PIN_STOPS: Record<string, number[] | { steps: string }> = {
  mc: [0, 1],
  fl: [0, 1],
  'fl-arch': [1],
  podium: [1],
  omt: [0.35, 1],
  tour: { steps: '.tour-shot' },
  stack: [1],
  encore: { steps: '.frame' },
};
/** Flowing (unpinned) blocks whose tops are resting points. */
const FLOW = '.reel, .stage:not(.pin-stage)';

const WHEEL_COMMIT = 150; // px of wheel travel before it lets go
const TOUCH_COMMIT = 56; // px of finger travel before it lets go
const LEAN = 54; // the most the stage gives before letting go

let stops: number[] = [];
let animating = false;
let tween: gsap.core.Tween | null = null;

const vh = () => innerHeight;
const maxY = () => ScrollTrigger.maxScroll(window);

function build() {
  const pins: { start: number; end: number }[] = [];
  const marks: number[] = [0, maxY()];

  ScrollTrigger.getAll().forEach((st) => {
    if (!st.pin) return;
    const range = { start: st.start, end: st.end };
    pins.push(range);
    const key = (st.trigger as HTMLElement | undefined)?.dataset.pin;
    const rule = key ? PIN_STOPS[key] : undefined;
    if (!rule) return; // a pure transition (the opening): it plays on the way to the next scene
    const span = range.end - range.start;
    if (Array.isArray(rule)) rule.forEach((f) => marks.push(range.start + span * f));
    else {
      const n = st.trigger!.querySelectorAll(rule.steps).length;
      for (let i = 0; i < n; i++) marks.push(range.start + span * (i === 0 ? 0 : (i + 0.12) / n));
    }
  });

  document.querySelectorAll<HTMLElement>(FLOW).forEach((el) => {
    // Flow blocks inside a pin spacer are already covered by their pin.
    const y = el.getBoundingClientRect().top + scrollY;
    if (!pins.some((p) => y > p.start + 2 && y < p.end - 2)) marks.push(y);
  });

  const max = maxY();
  const sorted = marks.map((y) => Math.round(Math.min(max, Math.max(0, y)))).sort((a, b) => a - b);
  const out: number[] = [];
  sorted.forEach((y) => {
    const last = out[out.length - 1];
    if (last === undefined || y - last > vh() * 0.22) out.push(y);
    else if (y === max) out[out.length - 1] = max; // the end of the show always wins
  });

  // Long stretches of flowing content get extra rests, so nothing is skipped unread.
  const filled: number[] = [];
  out.forEach((y, i) => {
    filled.push(y);
    const next = out[i + 1];
    if (next === undefined) return;
    const touchesPin = pins.some((p) => y < p.end - 2 && next > p.start + 2);
    const gap = next - y;
    if (touchesPin || gap <= vh() * 1.15) return;
    const n = Math.ceil(gap / (vh() * 0.85));
    for (let k = 1; k < n; k++) filled.push(Math.round(y + (gap * k) / n));
  });
  stops = filled;
}

function targetFrom(from: number, dir: 1 | -1) {
  if (dir > 0) return stops.find((s) => s > from + 6) ?? maxY();
  for (let i = stops.length - 1; i >= 0; i--) if (stops[i] < from - 6) return stops[i];
  return 0;
}

function go(y: number) {
  const dist = Math.abs(y - scrollY) / vh();
  if (dist < 0.005) return;
  tween?.kill();
  animating = true;
  tween = gsap.to(window, {
    scrollTo: { y, autoKill: false },
    duration: gsap.utils.clamp(0.75, 2.4, 0.5 + dist * 0.4),
    ease: 'power2.inOut',
    onComplete: () => { animating = false; settledAt = performance.now(); },
  });
}

function springBack(y: number) {
  tween?.kill();
  tween = gsap.to(window, { scrollTo: { y, autoKill: false }, duration: 0.45, ease: 'power3.out' });
}

/** The give before it lets go: quick at first, then stiffer. */
const lean = (travel: number, commit: number) => Math.sign(travel) * LEAN * (1 - Math.exp((-1.6 * Math.abs(travel)) / commit));

let settledAt = 0;

function initWheel() {
  let acc = 0, base = 0, lastTs = 0, idle = 0;
  addEventListener('wheel', (e) => {
    if (e.ctrlKey) return; // pinch-zoom on trackpads
    e.preventDefault();
    const now = performance.now();
    const quiet = now - lastTs > 160;
    lastTs = now;
    // While gliding, and while a trackpad's momentum is still running out, input is swallowed.
    if (animating || (!quiet && now - settledAt < 1200 && acc === 0)) return;

    const d = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? vh() : 1);
    if (!d) return;
    if (acc === 0) { tween?.kill(); base = scrollY; }
    if (Math.sign(d) !== Math.sign(acc)) acc = 0;
    acc += d;

    clearTimeout(idle);
    if (Math.abs(acc) >= WHEEL_COMMIT) {
      const dir = acc > 0 ? 1 : -1;
      acc = 0;
      go(targetFrom(base, dir));
      return;
    }
    scrollTo(0, base + lean(acc, WHEEL_COMMIT));
    idle = window.setTimeout(() => { acc = 0; springBack(base); }, 220);
  }, { passive: false });
}

function initTouch() {
  let y0 = 0, x0 = 0, t0 = 0, base = 0, live = false;
  addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) { live = false; return; }
    live = true;
    y0 = e.touches[0].clientY; x0 = e.touches[0].clientX; t0 = performance.now();
    if (!animating) { tween?.kill(); base = scrollY; }
  }, { passive: true });
  addEventListener('touchmove', (e) => {
    if (!live || e.touches.length !== 1) return;
    e.preventDefault();
    if (animating) return;
    const dy = y0 - e.touches[0].clientY;
    scrollTo(0, base + lean(dy, TOUCH_COMMIT * 1.6));
  }, { passive: false });
  addEventListener('touchend', (e) => {
    if (!live) return;
    live = false;
    if (animating) return;
    const t = e.changedTouches[0];
    const dy = y0 - t.clientY, dx = x0 - t.clientX;
    const v = Math.abs(dy) / Math.max(1, performance.now() - t0); // px per ms
    if (Math.abs(dy) > Math.abs(dx) && (Math.abs(dy) >= TOUCH_COMMIT || (Math.abs(dy) > 18 && v > 0.45))) go(targetFrom(base, dy > 0 ? 1 : -1));
    else if (Math.abs(scrollY - base) > 1) springBack(base);
  }, { passive: true });
}

function initKeys() {
  addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    const el = e.target as HTMLElement;
    if (el.closest('input, textarea, select, [contenteditable]')) return;
    const space = e.key === ' ';
    if (space && el.closest('button, a')) return;
    let y: number | null = null;
    const from = animating && tween ? Number((tween.vars.scrollTo as { y: number }).y) : scrollY;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (space && !e.shiftKey)) y = targetFrom(from, 1);
    else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (space && e.shiftKey)) y = targetFrom(from, -1);
    else if (e.key === 'Home') y = 0;
    else if (e.key === 'End') y = maxY();
    if (y === null) return;
    e.preventDefault();
    go(y);
  });
}

export function initScenes() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  ScrollTrigger.addEventListener('refresh', build);
  build();
  initWheel();
  initTouch();
  initKeys();
}

/** For debugging in the console: the resting points, in px. */
export const sceneStops = () => stops.slice();
