/**
 * Scenes: scroll freely inside a scene; between scenes, the show takes over.
 * At a scene's edge the stage resists for a moment. Push a little more and it lets go,
 * gliding through the transition to the start of the next scene (or the end of the last).
 * Wheel, touch and keyboard share the same rules. Reduced motion keeps plain native scroll.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Scene = { start: number; end: number };

/** Unpinned blocks; each is a scene. Pinned stages are scenes over their pin. */
const FLOW = '.reel, .chapter:not(#opening) .stage:not(.pin-stage)';

const WHEEL_COMMIT = 110; // wheel travel at an edge before it lets go, over at least two wheel events (a mouse's second notch)
const TOUCH_COMMIT = 36; // finger travel at an edge before it lets go
const LEAN = 48; // the most the stage gives at an edge
const EDGE = 2; // px tolerance for "at the edge"

let scenes: Scene[] = [];
let gliding = false;
let leaning = false; // the wheel is pressing against an edge
let pulling: 0 | 1 | -1 = 0; // a finger is pulling against an edge
let tween: gsap.core.Tween | null = null;
let settledAt = 0;

const vh = () => innerHeight;
const maxY = () => ScrollTrigger.maxScroll(window);
/** How far into a transition still counts as "only just past the edge". */
const nearEdge = () => vh() * 0.3;

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

/** The scene holding y, or -1 when y sits in a transition between two scenes. */
const sceneAt = (y: number) => scenes.findIndex((s) => y >= s.start - EDGE && y <= s.end + EDGE);
/** The scenes either side of a transition point. */
const around = (y: number) => {
  const next = scenes.findIndex((s) => s.start > y);
  return { prev: next === -1 ? scenes.length - 1 : next - 1, next };
};

function glide(y: number) {
  const dist = Math.abs(y - scrollY) / vh();
  if (dist < 0.003) return;
  tween?.kill();
  gliding = true;
  tween = gsap.to(window, {
    scrollTo: { y, autoKill: false },
    duration: gsap.utils.clamp(1.1, 2.4, 0.75 + dist * 0.5),
    ease: 'power2.inOut',
    onComplete: () => { gliding = false; settledAt = performance.now(); },
  });
}

/** Leave in a direction: to the next scene's start, or the previous scene's end. */
function leave(from: number, dir: 1 | -1) {
  const i = sceneAt(from);
  let t: Scene | undefined;
  if (i !== -1) t = scenes[i + dir];
  else { const { prev, next } = around(from); t = dir > 0 ? scenes[next] : scenes[prev]; }
  if (t) glide(dir > 0 ? t.start : t.end);
}

function springTo(y: number) {
  tween?.kill();
  tween = gsap.to(window, { scrollTo: { y, autoKill: false }, duration: 0.5, ease: 'power3.out' });
}

/** The give at an edge: quick at first, then stiffer. */
const lean = (travel: number, commit: number) => Math.sign(travel) * LEAN * (1 - Math.exp((-1.4 * Math.abs(travel)) / commit));

function initWheel() {
  let acc = 0, pushes = 0, edge = 0, lastTs = 0, idle = 0, locked = false;
  addEventListener('wheel', (e) => {
    if (e.ctrlKey) return; // pinch-zoom on trackpads
    const now = performance.now();
    const quiet = now - lastTs > 140;
    lastTs = now;
    if (gliding) { e.preventDefault(); return; }
    // A trackpad's momentum left over from a glide is swallowed, not scrolled.
    if (!quiet && now - settledAt < 900) { e.preventDefault(); return; }

    const d = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? vh() : 1);
    if (!d) return;
    const dir: 1 | -1 = d > 0 ? 1 : -1;
    const y = leaning ? edge : scrollY;
    let i = sceneAt(y);

    if (!leaning && i !== -1) {
      // Inside a scene and not about to cross its edge: plain native scrolling.
      const s = scenes[i];
      const lim = dir > 0 ? s.end : s.start;
      const atEdge = Math.abs(y - lim) <= EDGE;
      if (!atEdge && (dir > 0 ? y + d < lim : y + d > lim)) return;
      e.preventDefault();
      if (!atEdge) {
        // Arrive at the edge and stop there. A scroll that was already running has to pause before it can push through.
        tween?.kill();
        scrollTo(0, lim);
        locked = !quiet;
        return;
      }
    } else e.preventDefault();

    if (i === -1) {
      // Smooth scrolling overshot an edge by a little: settle on that edge. Deep in a transition: finish it.
      const { prev, next } = around(y);
      const back = dir > 0 ? scenes[prev] : scenes[next];
      const lim = back && (dir > 0 ? back.end : back.start);
      if (back && Math.abs(y - lim) < nearEdge()) { tween?.kill(); scrollTo(0, lim); locked = !quiet; i = scenes.indexOf(back); if (locked) return; }
      else { leave(y, dir); return; }
    }

    if (locked) { if (!quiet) return; locked = false; }
    const s = scenes[i];
    if (!leaning || Math.sign(acc) !== dir) { tween?.kill(); acc = 0; pushes = 0; edge = dir > 0 ? s.end : s.start; }
    if (!scenes[i + dir]) { acc = 0; leaning = false; return; } // the very start or end of the show
    leaning = true;
    acc += d; pushes++;
    clearTimeout(idle);
    if (pushes >= 2 && Math.abs(acc) >= WHEEL_COMMIT) { acc = 0; leaning = false; leave(edge, dir); return; }
    scrollTo(0, edge + lean(acc, WHEEL_COMMIT));
    idle = window.setTimeout(() => { acc = 0; leaning = false; springTo(edge); }, 480);
  }, { passive: false });
}

function initTouch() {
  let y0 = 0, x0 = 0, t0 = 0, edge = 0, touching = false, decided = false;
  addEventListener('touchstart', (e) => {
    touching = e.touches.length === 1;
    decided = false; pulling = 0;
    y0 = e.touches[0].clientY; x0 = e.touches[0].clientX; t0 = performance.now();
  }, { passive: true });

  addEventListener('touchmove', (e) => {
    if (!touching || e.touches.length !== 1) return;
    if (gliding) { e.preventDefault(); return; }
    const dy = y0 - e.touches[0].clientY;
    if (!decided && Math.abs(dy) > 4) {
      decided = true;
      // At a scene's edge and pulling outwards: the stage resists. Anything else scrolls natively.
      const i = sceneAt(scrollY), dir: 1 | -1 = dy > 0 ? 1 : -1;
      if (i !== -1 && scenes[i + dir]) {
        const lim = dir > 0 ? scenes[i].end : scenes[i].start;
        if (Math.abs(scrollY - lim) <= EDGE * 2) { pulling = dir; edge = lim; tween?.kill(); }
      }
    }
    if (!pulling) return;
    e.preventDefault();
    const pull = Math.sign(dy) === pulling ? dy : 0;
    scrollTo(0, edge + lean(pull, TOUCH_COMMIT * 1.4));
  }, { passive: false });

  addEventListener('touchend', (e) => {
    if (!touching) return;
    touching = false;
    if (!pulling || gliding) { pulling = 0; return; }
    const t = e.changedTouches[0];
    const dy = y0 - t.clientY, dx = x0 - t.clientX;
    const v = Math.abs(dy) / Math.max(1, performance.now() - t0);
    const out = Math.sign(dy) === pulling && Math.abs(dy) > Math.abs(dx);
    if (out && (Math.abs(dy) >= TOUCH_COMMIT || v > 0.35)) leave(edge, pulling);
    else springTo(edge);
    pulling = 0;
  }, { passive: true });
}

/** Momentum or a hard swipe that leaves the page partway through a transition: settle or carry on. */
function initSettle() {
  let lastY = scrollY, travel = 0, timer = 0;
  addEventListener('scroll', () => {
    travel = scrollY - lastY || travel;
    lastY = scrollY;
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (gliding || leaning || pulling || scrollY > maxY() - EDGE || sceneAt(scrollY) !== -1) return;
      const { prev, next } = around(scrollY);
      const a = scenes[prev], b = scenes[next];
      if (!a || !b) return;
      if (travel > 0) scrollY - a.end < nearEdge() ? springTo(a.end) : glide(b.start);
      else b.start - scrollY < nearEdge() ? springTo(b.start) : glide(a.end);
    }, 120);
  }, { passive: true });
}

function initKeys() {
  addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    const el = e.target as HTMLElement;
    if (el.closest('input, textarea, select, [contenteditable]')) return;
    const space = e.key === ' ';
    if (space && el.closest('button, a')) return;
    let dir: 1 | -1 | 0 = 0, step = 0;
    if (e.key === 'ArrowDown') { dir = 1; step = 80; }
    else if (e.key === 'ArrowUp') { dir = -1; step = 80; }
    else if (e.key === 'PageDown' || (space && !e.shiftKey)) { dir = 1; step = vh() * 0.85; }
    else if (e.key === 'PageUp' || (space && e.shiftKey)) { dir = -1; step = vh() * 0.85; }
    else if (e.key === 'Home') { e.preventDefault(); glide(0); return; }
    else if (e.key === 'End') { e.preventDefault(); glide(maxY()); return; }
    if (!dir) return;
    e.preventDefault();
    if (gliding) return;
    const y = scrollY, i = sceneAt(y);
    if (i === -1) { leave(y, dir); return; }
    const lim = dir > 0 ? scenes[i].end : scenes[i].start;
    // Inside a scene, keys scroll like normal; at its edge they move on to the next scene.
    if (Math.abs(y - lim) <= EDGE) leave(y, dir);
    else {
      tween?.kill();
      const to = dir > 0 ? Math.min(lim, y + step) : Math.max(lim, y - step);
      tween = gsap.to(window, { scrollTo: { y: to, autoKill: false }, duration: step > 100 ? 0.6 : 0.25, ease: 'power2.out' });
    }
  });
}

export function initScenes() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  ScrollTrigger.addEventListener('refresh', build);
  build();
  initWheel();
  initTouch();
  initSettle();
  initKeys();
}

/** For debugging: the scenes, as [start, end] scroll ranges in px. */
export const sceneRanges = () => scenes.map((s) => [s.start, s.end]);
