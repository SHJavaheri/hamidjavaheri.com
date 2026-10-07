/** Tiny isometric engine for the exploded architecture diagrams. Units are grid cells. */

const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);

export type Pt = { x: number; y: number };

/** Project a point on the iso grid (x right-back, y left-back, z up) to SVG space. */
export function iso(x: number, y: number, z: number, u: number, ox = 0, oy = 0): Pt {
  return { x: ox + (x - y) * COS * u, y: oy + (x + y) * SIN * u - z * u };
}

const path = (pts: Pt[]) => 'M' + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L') + 'Z';

export type Slab = { top: string; left: string; right: string; topCenter: Pt; anchor: Pt };

/** A box at (x, y, z) sized w (along x) × d (along y) × h (up). */
export function slab(x: number, y: number, z: number, w: number, d: number, h: number, u: number, ox = 0, oy = 0): Slab {
  const P = (a: number, b: number, c: number) => iso(a, b, c, u, ox, oy);
  const t = z + h;
  return {
    top: path([P(x, y, t), P(x + w, y, t), P(x + w, y + d, t), P(x, y + d, t)]),
    // the two visible sides: +y face (left) and +x face (right)
    left: path([P(x, y + d, t), P(x + w, y + d, t), P(x + w, y + d, z), P(x, y + d, z)]),
    right: path([P(x + w, y, t), P(x + w, y + d, t), P(x + w, y + d, z), P(x + w, y, z)]),
    topCenter: P(x + w / 2, y + d / 2, t),
    anchor: P(x + w, y, t), // back-right top corner: where labels hang from
  };
}

/** A flat parallelogram on a box's top face, inset by `pad`, for screens and glyphs. */
export function topInset(x: number, y: number, z: number, w: number, d: number, pad: number, u: number, ox = 0, oy = 0) {
  const P = (a: number, b: number) => iso(a, b, z, u, ox, oy);
  return path([P(x + pad, y + pad), P(x + w - pad, y + pad), P(x + w - pad, y + d - pad), P(x + pad, y + d - pad)]);
}

/** A face-aligned rectangle on the right (+x) face, for screens on towers. */
export function rightInset(x: number, y: number, z: number, w: number, d: number, h: number, pad: number, u: number, ox = 0, oy = 0) {
  const P = (b: number, c: number) => iso(x + w, b, c, u, ox, oy);
  return path([P(y + pad, z + h - pad), P(y + d - pad, z + h - pad), P(y + d - pad, z + pad), P(y + pad, z + pad)]);
}
export function leftInset(x: number, y: number, z: number, w: number, d: number, h: number, pad: number, u: number, ox = 0, oy = 0) {
  const P = (a: number, c: number) => iso(a, y + d, c, u, ox, oy);
  return path([P(x + pad, z + h - pad), P(x + w - pad, z + h - pad), P(x + w - pad, z + pad), P(x + pad, z + pad)]);
}
