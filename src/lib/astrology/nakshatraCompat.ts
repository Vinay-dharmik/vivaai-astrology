import { NAKSHATRAS, NAK_LORDS } from "./constants";
import {
  GANA_BY_INDEX,
  YONI_BY_INDEX,
  NADI_BY_INDEX,
  DEITY_BY_INDEX,
  SYMBOL_BY_INDEX,
} from "./nakshatraProfiles";

// ── Nakshatra detailed data ──────────────────────

export interface NakshatraInfo {
  name: string;
  lord: string;
  deity: string;
  gana: "Deva" | "Manushya" | "Rakshasa";
  yoni: string;
  nadi: "Aadi" | "Madhya" | "Antya";
  element: string;
  symbol: string;
  quality: string;
}

// Attributes come from the shared Nakshatra profiles so there is exactly one
// classical table on the site. These used to be duplicated here and on the
// detail page, and the two copies disagreed with each other.

export const NAKSHATRA_DATA: NakshatraInfo[] = NAKSHATRAS.map((n, i) => ({
  name: n,
  lord: NAK_LORDS[i],
  deity: DEITY_BY_INDEX[i],
  gana: GANA_BY_INDEX[i],
  yoni: YONI_BY_INDEX[i],
  nadi: NADI_BY_INDEX[i],
  element: ["Fire","Earth","Air","Water"][i % 4],
  symbol: SYMBOL_BY_INDEX[i],
  quality: ["Kshipra","Ugra","Mridu","Tikshna","Sthira","Chara","Dhruva"][i % 7],
}));

// ── Compatibility calculation (Ashtakoot-style for Nakshatras) ──

export interface NakshatraCompatResult {
  score: number;
  maxScore: number;
  percentage: number;
  verdict: string;
  ganaMatch: { score: number; max: number; detail: string };
  yoniMatch: { score: number; max: number; detail: string };
  nadiMatch: { score: number; max: number; detail: string };
  lordMatch: { score: number; max: number; detail: string };
  overallAdvice: string;
  strengths: string[];
  challenges: string[];
  remedies: string[];
}

export function getNakshatraCompat(n1: string, n2: string): NakshatraCompatResult {
  const idx1 = NAKSHATRAS.findIndex(n => slugify(n) === n1);
  const idx2 = NAKSHATRAS.findIndex(n => slugify(n) === n2);
  const d1 = NAKSHATRA_DATA[idx1 >= 0 ? idx1 : 0];
  const d2 = NAKSHATRA_DATA[idx2 >= 0 ? idx2 : 0];

  // Gana matching (6 pts max)
  const ganaScore = d1.gana === d2.gana ? 6 : (d1.gana === "Deva" && d2.gana === "Manushya") || (d2.gana === "Deva" && d1.gana === "Manushya") ? 3 : 0;
  const ganaDetail = d1.gana === d2.gana ? `Both ${d1.gana} — excellent temperament match` : ganaScore === 3 ? `${d1.gana}-${d2.gana} — moderate compatibility` : `${d1.gana}-${d2.gana} — requires understanding`;

  // Yoni matching (4 pts max)
  const yoniScore = d1.yoni === d2.yoni ? 4 : 2;
  const yoniDetail = d1.yoni === d2.yoni ? `Both ${d1.yoni} — strong physical compatibility` : `${d1.yoni} & ${d2.yoni} — complementary energies`;

  // Nadi matching (8 pts max) — same nadi = 0, different = 8
  const nadiScore = d1.nadi === d2.nadi ? 0 : 8;
  const nadiDetail = d1.nadi !== d2.nadi ? `${d1.nadi}-${d2.nadi} — excellent health compatibility` : `Both ${d1.nadi} — Nadi Dosha present, remedies recommended`;

  // Lord matching (5 pts max)
  const lordScore = d1.lord === d2.lord ? 5 : ["Jupiter","Venus"].includes(d1.lord) || ["Jupiter","Venus"].includes(d2.lord) ? 3 : 2;
  const lordDetail = d1.lord === d2.lord ? `Both ruled by ${d1.lord} — harmonious planetary energy` : `${d1.lord} & ${d2.lord} — ${lordScore >= 3 ? "favorable" : "neutral"} planetary synergy`;

  const total = ganaScore + yoniScore + nadiScore + lordScore;
  const maxTotal = 23;
  const pct = Math.round((total / maxTotal) * 100);

  const verdict = pct >= 75 ? "Highly Compatible — Excellent Match" : pct >= 55 ? "Good Compatibility — Favorable Union" : pct >= 35 ? "Moderate Compatibility — Requires Effort" : "Challenging — Remedies Strongly Recommended";

  const strengths: string[] = [];
  const challenges: string[] = [];
  if (ganaScore >= 3) strengths.push(`Strong temperament alignment (${d1.gana}-${d2.gana})`);
  else challenges.push(`Gana mismatch (${d1.gana} vs ${d2.gana}) may cause disagreements`);
  if (nadiScore > 0) strengths.push("No Nadi Dosha — healthy progeny indicated");
  else challenges.push("Nadi Dosha present — may affect health of offspring");
  if (yoniScore >= 4) strengths.push("Excellent physical and emotional bonding");
  if (lordScore >= 4) strengths.push(`Ruling planet harmony (${d1.lord})`);

  const remedies = [
    nadiScore === 0 ? "Nadi Dosha remedy: Donate gold and grains on a Monday" : "",
    ganaScore === 0 ? "Perform Gana Dosha Shanti Puja for harmonious relationship" : "",
    `Chant ${d1.lord} beej mantra together for planetary blessings`,
    `Wear gemstone for ${d2.lord} to strengthen compatibility`,
  ].filter(Boolean);

  return {
    score: total, maxScore: maxTotal, percentage: pct, verdict,
    ganaMatch: { score: ganaScore, max: 6, detail: ganaDetail },
    yoniMatch: { score: yoniScore, max: 4, detail: yoniDetail },
    nadiMatch: { score: nadiScore, max: 8, detail: nadiDetail },
    lordMatch: { score: lordScore, max: 5, detail: lordDetail },
    overallAdvice: pct >= 55 ? `The ${d1.name}-${d2.name} combination shows positive indicators for a harmonious relationship. The planetary energies of ${d1.lord} and ${d2.lord} create a supportive foundation.` : `The ${d1.name}-${d2.name} combination requires conscious effort and mutual understanding. Remedies can significantly improve compatibility.`,
    strengths, challenges, remedies,
  };
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function unslugify(slug: string): string {
  return NAKSHATRAS.find(n => slugify(n) === slug) || slug;
}
