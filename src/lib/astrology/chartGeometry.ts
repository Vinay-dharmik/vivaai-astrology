/**
 * Geometry for the two traditional Kundali chart layouts.
 *
 * The North Indian house cells used to be a hand-typed table of label
 * coordinates. Four of the twelve sat outside the polygon they were labelling,
 * so planets in houses 3, 5, 9 and 11 were drawn in the neighbouring house.
 * Everything here is derived from the construction instead: draw the square,
 * the two diagonals and the inner diamond, and read the twelve regions off the
 * intersections. Nothing is measured by eye.
 */

export interface Pt {
  x: number;
  y: number;
}

export interface HouseCell {
  /** Position in the diagram, 1–12. House 1 is the top rhombus. */
  index: number;
  polygon: Pt[];
  /** Area centroid — where a stack of planet labels is centred. */
  centroid: Pt;
  /** Where the Rashi number sits: toward the centre of the diagram. */
  signAnchor: Pt;
  /** Vertical extent of the polygon, for laying out stacked text. */
  top: number;
  bottom: number;
}

// ── Polygon helpers ───────────────────────────────────────

/** Area centroid of a simple polygon (shoelace). */
export function polygonCentroid(pts: Pt[]): Pt {
  let a = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    const cross = p.x * q.y - q.x * p.y;
    a += cross;
    cx += (p.x + q.x) * cross;
    cy += (p.y + q.y) * cross;
  }
  a *= 0.5;
  if (Math.abs(a) < 1e-9) {
    // Degenerate — fall back to the vertex average.
    return {
      x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
      y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
    };
  }
  return { x: cx / (6 * a), y: cy / (6 * a) };
}

/**
 * Horizontal extent of a polygon at height `y`.
 *
 * This is what makes text fitting honest: in a triangular house the usable
 * width changes with every line, so each line is measured against the width
 * actually available at its own baseline rather than against the cell's
 * bounding box.
 */
export function spanAtY(pts: Pt[], y: number): { x0: number; x1: number } | null {
  const xs: number[] = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    if (p.y === q.y) continue;
    const lo = Math.min(p.y, q.y);
    const hi = Math.max(p.y, q.y);
    if (y < lo || y > hi) continue;
    xs.push(p.x + ((y - p.y) / (q.y - p.y)) * (q.x - p.x));
  }
  if (xs.length < 2) return null;
  return { x0: Math.min(...xs), x1: Math.max(...xs) };
}

function bounds(pts: Pt[]) {
  return {
    top: Math.min(...pts.map((p) => p.y)),
    bottom: Math.max(...pts.map((p) => p.y)),
  };
}

/**
 * The width available to a band of height `y1 - y0`, not to a single baseline.
 *
 * A line of text is a box, not a ray. In a triangular house the polygon
 * narrows across the height of that box, so measuring only at the baseline
 * lets the corners of the glyphs poke through the hypotenuse — which is
 * exactly how the old chart put planets in the wrong house. Sampling the band
 * and keeping the tightest span makes the fit conservative everywhere.
 */
export function spanInBand(pts: Pt[], y0: number, y1: number, samples = 7): { x0: number; x1: number } | null {
  let lo = -Infinity;
  let hi = Infinity;
  for (let i = 0; i < samples; i++) {
    const y = y0 + ((y1 - y0) * i) / (samples - 1);
    const s = spanAtY(pts, y);
    if (!s) return null;
    lo = Math.max(lo, s.x0);
    hi = Math.min(hi, s.x1);
  }
  return hi > lo ? { x0: lo, x1: hi } : null;
}

function cell(index: number, polygon: Pt[], centre: Pt): HouseCell {
  const centroid = polygonCentroid(polygon);
  const { top, bottom } = bounds(polygon);

  // By convention the Rashi number sits toward the middle of the diagram. It
  // cannot simply be lerped toward the centre point, though: for the eight
  // corner triangles that ray leaves the polygon almost immediately. Aim at
  // the polygon's own vertex nearest the centre instead — every cell here is
  // convex, so a point between the centroid and one of its vertices is always
  // inside the cell.
  const target = polygon.reduce((best, p) =>
    (p.x - centre.x) ** 2 + (p.y - centre.y) ** 2 < (best.x - centre.x) ** 2 + (best.y - centre.y) ** 2
      ? p
      : best
  );
  const t = 0.55;
  const signAnchor = {
    x: centroid.x + (target.x - centroid.x) * t,
    y: centroid.y + (target.y - centroid.y) * t,
  };

  return { index, polygon, centroid, signAnchor, top, bottom };
}

// ── North Indian (diamond) ────────────────────────────────

/**
 * The twelve house cells of a North Indian chart inscribed in a square of
 * side `size` inset by `pad`.
 *
 * Construction: the outer square, both diagonals, and the diamond joining the
 * midpoints of the sides. The diamond is cut by the diagonals into four rhombi
 * (houses 1, 4, 7, 10 — top, left, bottom, right) and each corner triangle is
 * cut by a diagonal into two triangles. Houses run anticlockwise from the top.
 */
export function northIndianCells(size: number, pad: number): HouseCell[] {
  const a = pad;
  const b = size - pad;
  const m = (a + b) / 2; // midpoint of a side
  const q = (a + m) / 2; // quarter point — where a diagonal meets the diamond
  const r = (m + b) / 2; // three-quarter point
  const centre: Pt = { x: m, y: m };

  const P = (x: number, y: number): Pt => ({ x, y });

  // Named vertices of the construction.
  const TL = P(a, a), TR = P(b, a), BR = P(b, b), BL = P(a, b);
  const T = P(m, a), R = P(b, m), B = P(m, b), L = P(a, m);
  const TLd = P(q, q); // diagonal ∩ diamond, top-left
  const TRd = P(r, q);
  const BRd = P(r, r);
  const BLd = P(q, r);

  return [
    cell(1, [T, TLd, centre, TRd], centre),        // top rhombus
    cell(2, [TL, T, TLd], centre),                 // top-left, upper
    cell(3, [TL, TLd, L], centre),                 // top-left, lower
    cell(4, [L, TLd, centre, BLd], centre),        // left rhombus
    cell(5, [L, BLd, BL], centre),                 // bottom-left, upper
    cell(6, [BL, BLd, B], centre),                 // bottom-left, lower
    cell(7, [B, BLd, centre, BRd], centre),        // bottom rhombus
    cell(8, [B, BRd, BR], centre),                 // bottom-right, lower
    cell(9, [BR, BRd, R], centre),                 // bottom-right, upper
    cell(10, [R, BRd, centre, TRd], centre),       // right rhombus
    cell(11, [R, TRd, TR], centre),                // top-right, lower
    cell(12, [TR, TRd, T], centre),                // top-right, upper
  ];
}

/** The lines that make up the North Indian frame, for stroking. */
export function northIndianFrame(size: number, pad: number) {
  const a = pad;
  const b = size - pad;
  const m = (a + b) / 2;
  return {
    outer: { x: a, y: a, w: b - a, h: b - a },
    diagonals: [
      { x1: a, y1: a, x2: b, y2: b },
      { x1: b, y1: a, x2: a, y2: b },
    ],
    diamond: `${m},${a} ${b},${m} ${m},${b} ${a},${m}`,
  };
}

// ── South Indian (fixed grid) ─────────────────────────────

/**
 * South Indian charts pin each Rashi to a fixed cell and let the Ascendant
 * move, which is the reverse of the North Indian convention. Aries is always
 * second from the left on the top row, and the signs run clockwise.
 */
const SOUTH_GRID: Record<number, { col: number; row: number }> = {
  0: { col: 1, row: 0 },  // Aries
  1: { col: 2, row: 0 },  // Taurus
  2: { col: 3, row: 0 },  // Gemini
  3: { col: 3, row: 1 },  // Cancer
  4: { col: 3, row: 2 },  // Leo
  5: { col: 3, row: 3 },  // Virgo
  6: { col: 2, row: 3 },  // Libra
  7: { col: 1, row: 3 },  // Scorpio
  8: { col: 0, row: 3 },  // Sagittarius
  9: { col: 0, row: 2 },  // Capricorn
  10: { col: 0, row: 1 }, // Aquarius
  11: { col: 0, row: 0 }, // Pisces
};

export interface SouthCell {
  /** Zodiac sign index, 0 = Aries. */
  signIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export function southIndianCells(size: number, pad: number): SouthCell[] {
  const inner = size - pad * 2;
  const s = inner / 4;
  return Object.entries(SOUTH_GRID).map(([sign, g]) => ({
    signIndex: Number(sign),
    x: pad + g.col * s,
    y: pad + g.row * s,
    w: s,
    h: s,
  }));
}

// ── Text fitting ──────────────────────────────────────────

/**
 * Rough advance width of a string at a given font size.
 *
 * SVG gives us no way to measure text before layout, and the alternative —
 * rendering, measuring in the DOM and reflowing — would break server rendering
 * and the PNG export. 0.58em per character is a safe average for the digits
 * and two-letter abbreviations that actually appear here.
 */
export function textWidth(s: string, fontSize: number): number {
  return s.length * fontSize * 0.58;
}

export interface FittedText {
  lines: string[][];
  fontSize: number;
  lineHeight: number;
}

/**
 * Packs planet tokens into lines that fit inside a polygon.
 *
 * Tries progressively smaller type and progressively shorter tokens rather
 * than letting labels spill across a house boundary, because a planet drawn in
 * the wrong house is not a cosmetic problem — it is a wrong chart.
 */
export function fitTokens(
  cellPoly: Pt[],
  centroid: Pt,
  variants: string[][],
  opts: { maxFont: number; minFont: number; padding: number }
): FittedText | null {
  for (const tokens of variants) {
    if (tokens.length === 0) return { lines: [], fontSize: opts.maxFont, lineHeight: 0 };
    for (let font = opts.maxFont; font >= opts.minFont; font -= 0.4) {
      const lineHeight = font * 1.22;
      const packed = packLines(cellPoly, centroid, tokens, font, lineHeight, opts.padding);
      if (packed) return { lines: packed, fontSize: font, lineHeight };
    }
  }
  return null;
}

function packLines(
  poly: Pt[],
  centroid: Pt,
  tokens: string[],
  font: number,
  lineHeight: number,
  padding: number
): string[][] | null {
  const { top, bottom } = bounds(poly);
  // Glyphs extend above and below the baseline; measure against that box.
  const half = font * 0.62;

  // Try 1..tokens.length lines; the stack is centred vertically on the centroid.
  for (let lineCount = 1; lineCount <= tokens.length; lineCount++) {
    const startY = centroid.y - ((lineCount - 1) * lineHeight) / 2;

    // Reject before packing if the stack cannot sit inside the polygon at all.
    if (startY - half < top + padding) continue;
    if (startY + (lineCount - 1) * lineHeight + half > bottom - padding) continue;

    const lines: string[][] = [];
    let cursor = 0;
    let ok = true;

    for (let i = 0; i < lineCount; i++) {
      const y = startY + i * lineHeight;
      const span = spanInBand(poly, y - half, y + half);
      if (!span) { ok = false; break; }
      const avail = span.x1 - span.x0 - padding * 2;
      if (avail <= 0) { ok = false; break; }

      const line: string[] = [];
      let used = 0;
      while (cursor < tokens.length) {
        const tok = tokens[cursor];
        const w = textWidth(tok, font);
        const sep = line.length ? textWidth("  ", font) : 0;
        if (line.length && used + sep + w > avail) break;
        if (!line.length && w > avail) { ok = false; break; }
        line.push(tok);
        used += sep + w;
        cursor++;
      }
      if (!ok) break;

      // Text is centred on the centroid's x, not on the span's midpoint, so
      // the usable width is bounded by the nearer edge on either side.
      const reach = Math.min(centroid.x - span.x0, span.x1 - centroid.x) - padding;
      if (used / 2 > reach) { ok = false; break; }

      lines.push(line);
    }

    if (ok && cursor === tokens.length && lines.every((l) => l.length > 0)) return lines;
  }
  return null;
}
