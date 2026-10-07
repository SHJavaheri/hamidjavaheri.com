/**
 * Silk: the stage wash, alive. A mostly-white ground with slow pools of the chapter's colours,
 * domain-warped so they flow into one another, drifting as you scroll and stirred like liquid
 * by the pointer. Colours cross-fade between chapters. Drawn at reduced resolution (it is all
 * soft focus anyway) and paused when the tab is hidden. Without WebGL, the CSS .rig stays.
 */

type RGB = [number, number, number];

/** Three colours per gel: the project's two brand colours and a third that sits between them. */
const PALETTES: Record<string, [string, string, string]> = {
  house: ['#e9a24a', '#f2c46b', '#e8a3a0'],
  mashoor: ['#d8728a', '#7cc8b6', '#f3b9a4'],
  firstline: ['#5b8def', '#3cc6dc', '#a9a2f2'],
  podium: ['#e2b04e', '#b9c0cc', '#d99a6c'],
  hublii: ['#e0a052', '#f3b46e', '#e59a86'],
  dev: ['#9d84dc', '#ecc35c', '#e6a3c8'],
  bethesda: ['#eba23c', '#a9765a', '#f4cf8f'],
  backstage: ['#e9a24a', '#d8728a', '#f2c46b'],
};

const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;

const VERT = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime, uScroll, uStir, uAmt, uDark;
uniform vec2 uMouse;
uniform vec3 uBg, uC1, uC2, uC3;

// 2D simplex noise (Ashima / Ian McEwan, MIT)
vec3 perm(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = perm(perm(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { s += a * snoise(p); p = p * 1.9 + vec2(1.7, 9.2); a *= 0.38; }
  return s;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y);

  // The pointer stirs the liquid: a swirl around it that grows with how fast it moves.
  vec2 m = vec2(uMouse.x * asp, uMouse.y);
  vec2 d = p - m;
  float fall = exp(-dot(d, d) / 0.06);
  float ang = uStir * fall * 2.2;
  float cs = cos(ang), sn = sin(ang);
  p = m + mat2(cs, -sn, sn, cs) * d;
  p += d * fall * 0.06; // and a soft push outward, like a fingertip in water

  float t = uTime * 0.045;
  vec2 q = p * 0.42 + vec2(0.0, uScroll * 0.00006);
  // Domain warping: noise displaced by noise, so the pools fold and flow instead of bobbing.
  vec2 w1 = vec2(fbm(q + vec2(0.0, t)), fbm(q + vec2(5.2, 1.3) - t));
  vec2 w2 = vec2(fbm(q + 0.8 * w1 + vec2(1.7, 9.2) + 0.6 * t), fbm(q + 0.8 * w1 + vec2(8.3, 2.8) - 0.5 * t));
  float n1 = fbm(q + 0.9 * w2);
  float n2 = fbm(q * 1.1 + 0.8 * w1 + vec2(3.1, -t));
  float n3 = fbm(q * 0.9 - 0.7 * w2 + vec2(-2.4, t * 0.7));

  // Each colour lives in its own pools; most of the stage stays white.
  float a1 = smoothstep(-0.05, 0.55, n1);
  float a2 = smoothstep(0.0, 0.6, n2);
  float a3 = smoothstep(0.05, 0.62, n3);

  // Keep the reading area calmer: stronger toward the edges and the top, gentler in the middle.
  vec2 c = (uv - vec2(0.5, 0.46)) * vec2(1.15, 1.0);
  float edge = mix(0.55, 1.0, smoothstep(0.08, 0.62, length(c)));
  edge *= mix(1.0, 1.12, smoothstep(0.55, 1.0, uv.y));

  vec3 col = uBg;
  float k = uAmt * edge;
  col = mix(col, uC1, a1 * k);
  col = mix(col, uC2, a2 * k * 0.9);
  col = mix(col, uC3, a3 * k * 0.8);
  // A faint bloom of colour under the pointer.
  col = mix(col, mix(uC2, uC1, 0.5), fall * (0.05 + uStir * 0.12) * uAmt * 2.0);

  // Light dithering so the soft gradients never band.
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}`;

export function initSilk() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-silk]');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
  if (!gl) return;

  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src); gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = shader(gl.VERTEX_SHADER, VERT), fs = shader(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = { res: U('uRes'), time: U('uTime'), scroll: U('uScroll'), stir: U('uStir'), amt: U('uAmt'), dark: U('uDark'), mouse: U('uMouse'), bg: U('uBg'), c1: U('uC1'), c2: U('uC2'), c3: U('uC3') };

  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(hover: none), (pointer: coarse)');

  // ---- size: soft focus, so a fraction of the pixels is plenty ----
  const size = () => {
    const scale = coarse.matches ? 0.35 : 0.5;
    canvas.width = Math.max(2, Math.round(innerWidth * scale));
    canvas.height = Math.max(2, Math.round(innerHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  size();
  addEventListener('resize', size, { passive: true });

  // ---- colours: cross-fade to the new chapter's palette, and to the house lights ----
  const isDark = () => root.dataset.theme === 'dark';
  const target = () => {
    const pal = (PALETTES[root.dataset.gel || 'house'] ?? PALETTES.house).map(hex);
    const bg = hex(isDark() ? '#050506' : '#fbfaf7');
    return { c: pal, bg, amt: isDark() ? 0.36 : 0.4 };
  };
  let cur = target();
  let from = cur, to = cur, mixT = 1;
  const retarget = () => { from = { c: cur.c.map((v) => [...v] as RGB), bg: [...cur.bg] as RGB, amt: cur.amt }; to = target(); mixT = 0; kick(); };
  new MutationObserver(retarget).observe(root, { attributes: true, attributeFilter: ['data-gel', 'data-theme'] });
  const lerp3 = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  // ---- the pointer: position eases after the cursor, speed becomes "stir" that slowly dies away ----
  const M = { x: 0.5, y: 0.6, tx: 0.5, ty: 0.6, stir: 0, live: false };
  let lx = 0, ly = 0, lt = 0;
  const point = (cx: number, cy: number) => {
    const now = performance.now();
    const nx = cx / innerWidth, ny = 1 - cy / innerHeight;
    if (M.live && now - lt < 100) {
      const v = Math.hypot(nx - lx, ny - ly) / Math.max(8, now - lt) * 16;
      M.stir = Math.min(1, M.stir + v * 3.2);
    }
    M.tx = nx; M.ty = ny; M.live = true; lx = nx; ly = ny; lt = now;
    kick();
  };
  addEventListener('pointermove', (e) => point(e.clientX, e.clientY), { passive: true });
  addEventListener('touchmove', (e) => { const t = e.touches[0]; if (t) point(t.clientX, t.clientY); }, { passive: true });

  let lastScroll = scrollY;
  addEventListener('scroll', () => {
    // Scrolling stirs it a little too, so the colour flows as the show moves.
    M.stir = Math.min(1, M.stir + Math.min(0.12, Math.abs(scrollY - lastScroll) / innerHeight * 0.35));
    lastScroll = scrollY;
    kick();
  }, { passive: true });

  // ---- the loop ----
  let raf = 0, running = false, last = performance.now(), clock = Math.random() * 400;
  const draw = (now: number) => {
    const dt = Math.min(50, now - last); last = now;
    if (!reduce.matches) clock += dt / 1000;

    if (mixT < 1) { mixT = Math.min(1, mixT + dt / 1400); const e = ease(mixT);
      cur = { c: from.c.map((v, i) => lerp3(v, to.c[i], e)), bg: lerp3(from.bg, to.bg, e), amt: from.amt + (to.amt - from.amt) * e }; }

    const k = 1 - Math.pow(1 - 0.06, dt / 16.7);
    if (!M.live && coarse.matches) { const t = clock * 0.12; M.tx = 0.5 + Math.sin(t) * 0.3; M.ty = 0.5 + Math.cos(t * 1.3) * 0.25; }
    M.x += (M.tx - M.x) * k; M.y += (M.ty - M.y) * k;
    M.stir *= Math.pow(0.965, dt / 16.7);

    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform1f(u.time, clock);
    gl.uniform1f(u.scroll, scrollY);
    gl.uniform1f(u.stir, reduce.matches ? 0 : M.stir);
    gl.uniform1f(u.amt, cur.amt);
    gl.uniform1f(u.dark, isDark() ? 1 : 0);
    gl.uniform2f(u.mouse, M.x, M.y);
    gl.uniform3fv(u.bg, cur.bg);
    gl.uniform3fv(u.c1, cur.c[0]); gl.uniform3fv(u.c2, cur.c[1]); gl.uniform3fv(u.c3, cur.c[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Reduced motion: draw when something changes, then rest.
    if (reduce.matches && mixT >= 1) { running = false; return; }
    raf = requestAnimationFrame(draw);
  };
  function kick() {
    if (running || document.hidden) return;
    running = true; last = performance.now();
    raf = requestAnimationFrame(draw);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { running = false; cancelAnimationFrame(raf); } else kick();
  });
  gl.canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); running = false; cancelAnimationFrame(raf); root.classList.remove('silk-on'); });

  root.classList.add('silk-on');
  kick();
}
