/**
 * Scenes: scrolling always belongs to the visitor. The show only steps in once they stop.
 * Inside a scene nothing is touched. Come to rest partway through the transition between two
 * scenes and the stage finishes the move for you: on to the next scene, or back if you had
 * barely left. Any scroll during that glide cancels it, so it can never fight the visitor.
 * Reduced motion keeps plain native scroll.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Scene = { start: number; end: number };

/** Unpinned blocks; each is a scene. Pinned stages are scenes over their pin. */
const FLOW = '.reel, .chapter:not(#opening) .stage:not(.pin-stage)';
const EDGE = 2; // px tolerance for "inside a scene"
const REST = 160; // ms without scrolling before the stage steps in
const BACK = 0.22; // stop within this share of a transition and it eases you back instead

let scenes: Scene[] = [];
let tween: gsap.core.Tween | null = null;

const vh = () => innerHeight;
const maxY = () => ScrollTrigger.maxScroll(window);

function build() {
  const list: Scene[] = [{ start: 0, end: 0 }]; // the opening: everything after it is the hero transition
  ScrollTrigger.getAll().forEach((st) => {
    const el = st.trigger as HTMLElement | undefined;
    if (st.pin && el?.dataset.pin) list.push({ start: st.start, end: st.end });
  });
  document.querySelectorAll<HTMLElement>(FLOW).forEach((el) => {
    const top = el.getBoundingClientRect().top + scrollY;
    list.push({ start: top, end: Math.max(top, top + el.offsetHeight - vh()) });
  });
  const max = maxY();
  list.forEach((s) => { s.start = Math.round(Math.min(max, s.start)); s.end = Math.round(Math.min(max, s.end)); });
  list.sort((a, b) => a.start - b.start);
  // Scenes that touch or overlap are one scene.
  const out: Scene[] = [];
  list.forEach((s) => {
    const last = out[out.length - 1];
    if (last && s.start <= last.end + EDGE) last.end = Math.max(last.end, s.end);
    else out.push({ ...s });
  });
  out[out.length - 1].end = max; // the curtain call runs to the very end
  scenes = out;
}

function glide(y: number) {
  const dist = Math.abs(y - scrollY) / vh();
  if (dist < 0.003) return;
  tween?.kill();
  tween = gsap.to(window, {
    // autoKill: the moment the visitor scrolls, the glide lets go.
    scrollTo: { y, autoKill: true, onAutoKill: () => { tween = null; } },
    duration: gsap.utils.clamp(0.6, 1.8, 0.5 + dist * 1.1),
    ease: 'power2.inOut',
    onComplete: () => { tween = null; },
  });
}

/** If the page came to rest between two scenes, finish the move. */
function settle(travel: number) {
  const y = scrollY;
  if (scenes.some((s) => y >= s.start - EDGE && y <= s.end + EDGE)) return;
  const next = scenes.findIndex((s) => s.start > y);
  const a = scenes[next - 1], b = scenes[next];
  if (!a || !b) return;
  const gap = b.start - a.end;
  const p = (y - a.end) / gap;
  if (travel >= 0) glide(p < BACK ? a.end : b.start);
  else glide(p > 1 - BACK ? b.start : a.end);
}

export function initScenes() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  ScrollTrigger.addEventListener('refresh', build);
  build();

  let touching = false, lastY = scrollY, travel = 0, timer = 0;
  const arm = () => {
    clearTimeout(timer);
    timer = window.setTimeout(() => { if (!touching && !tween) settle(travel); }, REST);
  };
  addEventListener('touchstart', () => { touching = true; clearTimeout(timer); }, { passive: true });
  addEventListener('touchend', () => { touching = false; arm(); }, { passive: true });
  addEventListener('touchcancel', () => { touching = false; arm(); }, { passive: true });
  addEventListener('scroll', () => {
    const d = scrollY - lastY;
    if (d) travel = d;
    lastY = scrollY;
    if (!tween) arm();
  }, { passive: true });
}

/** For debugging: the scenes, as [start, end] scroll ranges in px. */
export const sceneRanges = () => scenes.map((s) => [s.start, s.end]);
