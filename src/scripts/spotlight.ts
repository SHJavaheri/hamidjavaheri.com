/**
 * House lights down: a soft, feathered follow-spot.
 * The darkness is drawn at a quarter resolution and scaled up by the browser, which gives the
 * pool and beam naturally feathered edges for almost no cost. Dust motes ride a full-res layer.
 * Outside the light, a veil adds a slight blur so the eye goes where the light is.
 */

export const light = { boost: 0, cboost: 0 };

type Mote = { t: number; s: number; sp: number; z: number; ph: number };

export function initSpotlight() {
  const root = document.documentElement;
  const dark = document.querySelector<HTMLCanvasElement>('[data-spot-dark]');
  const dust = document.querySelector<HTMLCanvasElement>('[data-spot-dust]');
  const veil = document.querySelector<HTMLElement>('[data-spot-veil]');
  if (!dark || !dust || !veil) return;
  const dctx = dark.getContext('2d', { alpha: true });
  const mctx = dust.getContext('2d', { alpha: true });
  if (!dctx || !mctx) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(hover: none), (pointer: coarse)');
  const SCALE = 0.25;
  let W = 0, H = 0, dpr = 1;

  const size = () => {
    W = innerWidth; H = innerHeight; dpr = Math.min(2, devicePixelRatio || 1);
    dark.width = Math.ceil(W * SCALE); dark.height = Math.ceil(H * SCALE);
    dust.width = Math.ceil(W * dpr); dust.height = Math.ceil(H * dpr);
  };
  size();
  addEventListener('resize', size, { passive: true });

  // The light's colour follows the stage gel.
  let tint = [255, 190, 120];
  const readGel = () => {
    const c = getComputedStyle(root).getPropertyValue('--gel-2').trim() || '#f2b33d';
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = c; const hex = ctx.fillStyle as string;
    if (hex.startsWith('#') && hex.length === 7) {
      const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
      // keep the light warm-white: mix the gel 35% into a warm white
      tint = rgb.map((v, i) => Math.round(v * 0.35 + [255, 236, 214][i] * 0.65));
    }
  };
  new MutationObserver(() => setTimeout(readGel, 400)).observe(root, { attributes: true, attributeFilter: ['data-gel'] });
  readGel();

  const L = { x: innerWidth * 0.5, y: innerHeight * 0.4, tx: innerWidth * 0.5, ty: innerHeight * 0.4, r: 0 };
  let pointerLive = false;
  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    pointerLive = true; L.tx = e.clientX; L.ty = e.clientY;
  }, { passive: true });
  document.addEventListener('pointerleave', () => { pointerLive = false; });

  const motes: Mote[] = Array.from({ length: 70 }, () => ({
    t: Math.random(), s: Math.random() * 2 - 1, sp: 0.0005 + Math.random() * 0.0012, z: 0.5 + Math.random() * 1.3, ph: Math.random() * 6.28,
  }));
  const cues = () => Array.from(document.querySelectorAll<HTMLElement>('.cue'));
  let cueList = cues();
  setTimeout(() => (cueList = cues()), 1500);

  const anchor = () => {
    const p = document.querySelector('[data-spot-anchor]')?.getBoundingClientRect();
    return p && p.bottom > 0 && p.top < innerHeight ? { x: p.left + p.width / 2, y: p.top + p.height * 0.55 } : null;
  };

  let running = false, last = performance.now(), raf = 0;

  const frame = (now: number) => {
    const dt = Math.min(50, now - last); last = now;
    if (!running) return;

    if (reduce.matches) { L.tx = W * 0.5; L.ty = H * 0.46; }
    else if (coarse.matches) { const t = now * 0.00022; L.tx = W * (0.5 + Math.sin(t) * 0.26); L.ty = H * (0.48 + Math.cos(t * 1.3) * 0.14); }
    else if (!pointerLive) { const a = anchor(); if (a) { L.tx = a.x; L.ty = a.y; } }

    const k = 1 - Math.pow(1 - 0.11, dt / 16.7);
    L.x += (L.tx - L.x) * k; L.y += (L.ty - L.y) * k;
    const boost = Math.max(light.boost, light.cboost);
    const baseR = Math.max(190, Math.min(W, H) * (coarse.matches ? 0.44 : 0.3));
    const tr = baseR * (1 + boost * 0.8);
    L.r += (tr - L.r) * k;
    const r = Math.max(4, L.r), x = L.x, y = L.y;
    const darkness = reduce.matches ? 0.5 : coarse.matches ? 0.66 : 0.82 - boost * 0.3;

    // ---- darkness, carved by the beam and pool (quarter-res => feathered) ----
    const s = SCALE;
    dctx.setTransform(s, 0, 0, s, 0, 0);
    dctx.globalCompositeOperation = 'source-over';
    dctx.clearRect(0, 0, W, H);
    dctx.fillStyle = `rgba(4,4,6,${darkness})`;
    dctx.fillRect(0, 0, W, H);

    const fx = W * 0.5 + (x - W * 0.5) * 0.28, fy = -H * 0.2;
    dctx.globalCompositeOperation = 'destination-out';
    // the beam: five widening layers, each faint, so the cone has no edge to speak of
    for (let i = 0; i < 5; i++) {
      const spread = r * (0.22 + i * 0.12);
      const g = dctx.createLinearGradient(fx, fy, x, y);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(0.6, `rgba(0,0,0,${0.035 - i * 0.004})`);
      g.addColorStop(1, `rgba(0,0,0,${0.075 - i * 0.011})`);
      dctx.fillStyle = g;
      dctx.beginPath();
      dctx.moveTo(fx - 8 - i * 10, fy); dctx.lineTo(fx + 8 + i * 10, fy);
      dctx.lineTo(x + spread, y); dctx.lineTo(x - spread, y);
      dctx.closePath(); dctx.fill();
    }
    // the pool: an eased falloff (no visible ring)
    dctx.save(); dctx.translate(x, y); dctx.scale(1, 0.88);
    const pg = dctx.createRadialGradient(0, 0, 0, 0, 0, r);
    for (let i = 0; i <= 12; i++) {
      const t = i / 12; const a = Math.pow(1 - t * t, 2); // smooth bell: full at centre, zero slope at the rim
      pg.addColorStop(t, `rgba(0,0,0,${a.toFixed(3)})`);
    }
    dctx.fillStyle = pg; dctx.beginPath(); dctx.arc(0, 0, r, 0, Math.PI * 2); dctx.fill(); dctx.restore();

    // a warm wash of the gel inside the pool
    dctx.globalCompositeOperation = 'source-over';
    dctx.save(); dctx.translate(x, y); dctx.scale(1, 0.88);
    const [tr_, tg_, tb_] = tint;
    const wg = dctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.1);
    wg.addColorStop(0, `rgba(${tr_},${tg_},${tb_},0.10)`);
    wg.addColorStop(0.55, `rgba(${tr_},${tg_},${tb_},0.05)`);
    wg.addColorStop(1, `rgba(${tr_},${tg_},${tb_},0)`);
    dctx.fillStyle = wg; dctx.beginPath(); dctx.arc(0, 0, r * 1.1, 0, Math.PI * 2); dctx.fill(); dctx.restore();

    // ---- dust motes drifting down the beam (full res) ----
    mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mctx.clearRect(0, 0, W, H);
    mctx.globalCompositeOperation = 'lighter';
    for (const m of motes) {
      if (!reduce.matches) { m.t += m.sp * dt * 0.06; if (m.t > 1) { m.t = 0; m.s = Math.random() * 2 - 1; } m.ph += dt * 0.002; }
      const px = fx + (x - fx) * m.t + m.s * r * 0.55 * m.t + Math.sin(m.ph) * 5;
      const py = fy + (y - fy) * m.t;
      const a = (0.1 + 0.22 * Math.abs(Math.sin(m.ph * 1.7))) * Math.min(1, m.t * 3) * (1 - m.t * 0.5);
      mctx.fillStyle = `rgba(${tr_},${tg_},${tb_},${a.toFixed(3)})`;
      mctx.beginPath(); mctx.arc(px, py, m.z, 0, Math.PI * 2); mctx.fill();
    }

    // ---- the soft blur outside the light ----
    veil.style.setProperty('--lx', `${x}px`);
    veil.style.setProperty('--ly', `${y}px`);
    veil.style.setProperty('--lr', `${r}px`);

    // ---- hidden presenter cues, readable only inside the light ----
    for (const c of cueList) {
      const b = c.getBoundingClientRect();
      if (b.bottom < -200 || b.top > H + 200) continue;
      c.style.setProperty('--lx', `${x - b.left}px`);
      c.style.setProperty('--ly', `${y - b.top}px`);
    }
    raf = requestAnimationFrame(frame);
  };

  const sync = () => {
    const on = root.dataset.theme === 'dark' && !document.hidden;
    dark.parentElement?.classList.toggle('live', on);
    if (on && !running) {
      running = true; last = performance.now();
      const a = anchor(); if (a && !pointerLive) { L.x = a.x; L.y = -120; L.tx = a.x; L.ty = a.y; }
      L.r = 0;
      raf = requestAnimationFrame(frame);
    } else if (!on && running) {
      running = false; cancelAnimationFrame(raf);
    }
  };
  addEventListener('hj:theme', () => requestAnimationFrame(sync));
  document.addEventListener('visibilitychange', sync);
  sync();
}
