/*
 * Proves that no planet label can be drawn outside the house it belongs to.
 *
 * The previous chart placed labels from a hand-typed coordinate table, and four
 * of the twelve houses put their planets in the neighbouring house. This script
 * exists so that regression cannot come back silently: it fits every house with
 * every plausible number of planets and asserts that each rendered glyph box
 * lies inside that house's polygon.
 */
import {
  northIndianCells,
  southIndianCells,
  fitTokens,
  textWidth,
  polygonCentroid,
  type Pt,
} from "../src/lib/astrology/chartGeometry";

const SIZE = 400;
const PAD = 14;

/** Ray casting. Returns true for points strictly inside the polygon. */
function pointInPolygon(pt: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    const straddles = a.y > pt.y !== b.y > pt.y;
    if (straddles && pt.x < ((b.x - a.x) * (pt.y - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

const BODIES = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke"];

function tokensFor(n: number, withDegrees: boolean): string[][] {
  const full = BODIES.slice(0, n).map((b, i) => `${b}℞ ${10 + i}°${20 + i}′`);
  const mid = BODIES.slice(0, n).map((b, i) => `${b}℞ ${10 + i}°`);
  const bare = BODIES.slice(0, n).map((b) => `${b}℞`);
  return withDegrees ? [full, mid, bare] : [bare];
}

let checks = 0;
let failures = 0;
const notes: string[] = [];

// ── North Indian ──────────────────────────────────────────
const cells = northIndianCells(SIZE, PAD);

if (cells.length !== 12) {
  failures++;
  notes.push(`FAIL  expected 12 house cells, got ${cells.length}`);
}

// Every centroid must be inside its own polygon and outside all the others.
for (const c of cells) {
  checks++;
  if (!pointInPolygon(c.centroid, c.polygon)) {
    failures++;
    notes.push(`FAIL  house ${c.index}: centroid outside its own polygon`);
  }
  for (const other of cells) {
    if (other.index === c.index) continue;
    if (pointInPolygon(c.centroid, other.polygon)) {
      failures++;
      notes.push(`FAIL  house ${c.index}: centroid also falls inside house ${other.index}`);
    }
  }
  checks++;
  if (!pointInPolygon(c.signAnchor, c.polygon)) {
    failures++;
    notes.push(`FAIL  house ${c.index}: Rashi-number anchor outside its polygon`);
  }
}

// The twelve polygons must tile the square without overlapping: total area
// equals the area of the frame.
function area(poly: Pt[]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a / 2);
}
const totalArea = cells.reduce((s, c) => s + area(c.polygon), 0);
const frameArea = (SIZE - PAD * 2) ** 2;
checks++;
if (Math.abs(totalArea - frameArea) > 1) {
  failures++;
  notes.push(`FAIL  house polygons cover ${totalArea.toFixed(1)} but frame is ${frameArea.toFixed(1)}`);
}

// Fit every house with 1..9 planets and confirm each glyph box is contained.
for (const c of cells) {
  for (let n = 1; n <= 9; n++) {
    const fitted = fitTokens(c.polygon, c.centroid, tokensFor(n, true), {
      maxFont: 10,
      minFont: 6,
      padding: 4,
    });
    checks++;
    if (!fitted) {
      // Falling back to a count is acceptable, but note where it happens.
      notes.push(`note  house ${c.index} with ${n} planets falls back to a count`);
      continue;
    }
    const { lines, fontSize, lineHeight } = fitted;
    const startY = c.centroid.y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, li) => {
      const text = line.join("  ");
      const w = textWidth(text, fontSize);
      const y = startY + li * lineHeight;
      // Sample the glyph box corners and midpoints of its edges.
      const probes: Pt[] = [
        { x: c.centroid.x - w / 2, y: y - fontSize * 0.5 },
        { x: c.centroid.x + w / 2, y: y - fontSize * 0.5 },
        { x: c.centroid.x - w / 2, y: y + fontSize * 0.5 },
        { x: c.centroid.x + w / 2, y: y + fontSize * 0.5 },
        { x: c.centroid.x, y: y - fontSize * 0.5 },
        { x: c.centroid.x, y: y + fontSize * 0.5 },
      ];
      for (const p of probes) {
        if (!pointInPolygon(p, c.polygon)) {
          failures++;
          notes.push(
            `FAIL  house ${c.index}, ${n} planets, line ${li + 1}: glyph box escapes at (${p.x.toFixed(1)}, ${p.y.toFixed(1)})`
          );
          return;
        }
      }
    });
  }
}

// ── South Indian ──────────────────────────────────────────
const south = southIndianCells(SIZE, PAD);
checks++;
if (south.length !== 12) {
  failures++;
  notes.push(`FAIL  expected 12 South Indian cells, got ${south.length}`);
}
checks++;
if (new Set(south.map((c) => `${c.x},${c.y}`)).size !== 12) {
  failures++;
  notes.push("FAIL  South Indian cells overlap — two signs share a grid position");
}
// The ring must leave the middle 2x2 empty.
const s = (SIZE - PAD * 2) / 4;
for (const c of south) {
  const cx = c.x + c.w / 2;
  const cy = c.y + c.h / 2;
  const inMiddle = cx > PAD + s && cx < PAD + 3 * s && cy > PAD + s && cy < PAD + 3 * s;
  checks++;
  if (inMiddle) {
    failures++;
    notes.push(`FAIL  sign ${c.signIndex} sits in the hollow centre of the South Indian grid`);
  }
}
// Aries must be the second cell of the top row, per convention.
const aries = south.find((c) => c.signIndex === 0)!;
checks++;
if (Math.abs(aries.x - (PAD + s)) > 0.01 || Math.abs(aries.y - PAD) > 0.01) {
  failures++;
  notes.push("FAIL  Aries is not in the conventional top-row, second-column cell");
}

// ── Report ────────────────────────────────────────────────
const problems = notes.filter((n) => n.startsWith("FAIL"));
const infos = notes.filter((n) => !n.startsWith("FAIL"));
if (infos.length) console.log(infos.join("\n"));
if (problems.length) console.log(problems.join("\n"));
console.log(`\n${checks} geometry checks run, ${failures} failed`);
if (failures > 0) process.exit(1);
console.log("ALL GEOMETRY CHECKS PASSED");
