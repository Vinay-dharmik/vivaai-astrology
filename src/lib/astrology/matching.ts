import { NAKSHATRAS, NAK_LORDS } from "./constants";
import type { NakshatraResult } from "./calculations";
import { getNakshatraInfo } from "./calculations";

// ── Ashtakoot Guna Matching ──────────────────────────────
// 8 aspects (koots) scored out of 36 total points

interface KootScore {
  name: string;
  maxPoints: number;
  score: number;
  description: string;
}

export interface MatchingResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  verdict: string;
  koots: KootScore[];
  manglikBoy: boolean;
  manglikGirl: boolean;
  manglikMatch: string;
  recommendation: string;
}

// Varna (spiritual compatibility) - 1 point
const VARNA_MAP: Record<number, number> = {};
// Nakshatras grouped by Varna: Brahmin(0), Kshatriya(1), Vaishya(2), Shudra(3)
[0, 5, 6, 11, 12, 17, 18, 23, 24].forEach((i) => (VARNA_MAP[i] = 0)); // Brahmin
[1, 4, 7, 10, 13, 16, 19, 22, 25].forEach((i) => (VARNA_MAP[i] = 1)); // Kshatriya
[2, 9, 8, 15, 14, 21, 20, 26].forEach((i) => (VARNA_MAP[i] = 2)); // Vaishya
[3, 8, 9, 14, 15, 20, 21, 26].forEach((i) => (VARNA_MAP[i] = 3)); // Shudra

function varnaScore(boyNak: number, girlNak: number): number {
  const bv = VARNA_MAP[boyNak] ?? 2;
  const gv = VARNA_MAP[girlNak] ?? 2;
  return bv >= gv ? 1 : 0;
}

// Vashya (dominance) - 2 points
function vashyaScore(boyMoonSign: number, girlMoonSign: number): number {
  // Simplified: same sign = 2, adjacent = 1, else 0
  if (boyMoonSign === girlMoonSign) return 2;
  if (Math.abs(boyMoonSign - girlMoonSign) <= 1 || Math.abs(boyMoonSign - girlMoonSign) === 11) return 1;
  return 0;
}

// Tara (birth star compatibility) - 3 points
function taraScore(boyNak: number, girlNak: number): number {
  const diff = ((boyNak - girlNak + 27) % 27);
  const tara = (diff % 9) + 1;
  // Auspicious taras: 1,2,4,6,8,9
  if ([1, 2, 4, 6, 8, 9].includes(tara)) return 3;
  if ([3, 5].includes(tara)) return 1.5;
  return 0;
}

// Yoni (sexual/physical compatibility) - 4 points
const YONI_ANIMALS = [
  "Horse", "Elephant", "Sheep", "Snake", "Dog", "Cat", "Rat", "Cow", "Buffalo",
  "Tiger", "Deer", "Monkey", "Mongoose", "Lion",
];
const NAK_YONI = [0,0,1,2,2,3,4,5,4,6,6,7,8,9,8,9,10,10,3,11,12,11,1,0,1,7,5];

function yoniScore(boyNak: number, girlNak: number): number {
  const by = NAK_YONI[boyNak] ?? 0;
  const gy = NAK_YONI[girlNak] ?? 0;
  if (by === gy) return 4;
  // Enemy pairs
  const enemies: [number, number][] = [[0,8],[1,1],[2,11],[3,12],[4,6],[5,6],[7,9],[10,3]];
  for (const [a, b] of enemies) {
    if ((by === a && gy === b) || (by === b && gy === a)) return 0;
  }
  return 2;
}

// Graha Maitri (planetary friendship) - 5 points
const PLANET_FRIEND: Record<string, string[]> = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mercury"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"],
  Rahu: ["Saturn", "Mercury", "Venus"],
  Ketu: ["Mars", "Jupiter"],
};

function grahaMaitriScore(boyLord: string, girlLord: string): number {
  if (boyLord === girlLord) return 5;
  const bf = PLANET_FRIEND[boyLord] || [];
  const gf = PLANET_FRIEND[girlLord] || [];
  const boyFriendly = bf.includes(girlLord);
  const girlFriendly = gf.includes(boyLord);
  if (boyFriendly && girlFriendly) return 5;
  if (boyFriendly || girlFriendly) return 3;
  return 0;
}

// Gana (temperament) - 6 points
function ganaScore(boyNak: number, girlNak: number): number {
  // Deva(0), Manushya(1), Rakshasa(2)
  const GANA = [0,1,2,0,0,1,0,0,2,2,1,0,0,2,0,2,0,2,2,1,1,0,2,2,1,0,0];
  const bg = GANA[boyNak] ?? 1;
  const gg = GANA[girlNak] ?? 1;
  if (bg === gg) return 6;
  if ((bg === 0 && gg === 1) || (bg === 1 && gg === 0)) return 5;
  if (bg === 2 || gg === 2) return 0;
  return 3;
}

// Bhakoot (sign compatibility) - 7 points
function bhakootScore(boyMoonSign: number, girlMoonSign: number): number {
  const diff = ((boyMoonSign - girlMoonSign + 12) % 12) + 1;
  // Inauspicious: 2/12, 5/9, 6/8
  if ([2, 12].includes(diff)) return 0;
  if ([5, 9].includes(diff)) return 0;
  if ([6, 8].includes(diff)) return 0;
  return 7;
}

// Nadi (health/genes) - 8 points
function nadiScore(boyNak: number, girlNak: number): number {
  // Aadi(0), Madhya(1), Antya(2)
  const NADI = [0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2];
  const bn = NADI[boyNak] ?? 0;
  const gn = NADI[girlNak] ?? 0;
  return bn === gn ? 0 : 8; // Same nadi = 0 (dosha), different = 8
}

// ── Main Matching Function ───────────────────────────────

export function calculateAshtakootMatch(
  boyMoonLon: number,
  girlMoonLon: number,
  boyMoonSign: number,
  girlMoonSign: number,
  boyMarsHouse: number | undefined,
  girlMarsHouse: number | undefined
): MatchingResult {
  const boyNak = getNakshatraInfo(boyMoonLon);
  const girlNak = getNakshatraInfo(girlMoonLon);
  const boyLord = NAK_LORDS[boyNak.index];
  const girlLord = NAK_LORDS[girlNak.index];

  const koots: KootScore[] = [
    { name: "Varna", maxPoints: 1, score: varnaScore(boyNak.index, girlNak.index), description: "Spiritual compatibility & ego levels" },
    { name: "Vashya", maxPoints: 2, score: vashyaScore(boyMoonSign, girlMoonSign), description: "Mutual attraction & dominance" },
    { name: "Tara", maxPoints: 3, score: taraScore(boyNak.index, girlNak.index), description: "Destiny & health compatibility" },
    { name: "Yoni", maxPoints: 4, score: yoniScore(boyNak.index, girlNak.index), description: "Physical & sexual compatibility" },
    { name: "Graha Maitri", maxPoints: 5, score: grahaMaitriScore(boyLord, girlLord), description: "Mental & intellectual compatibility" },
    { name: "Gana", maxPoints: 6, score: ganaScore(boyNak.index, girlNak.index), description: "Temperament & behavior match" },
    { name: "Bhakoot", maxPoints: 7, score: bhakootScore(boyMoonSign, girlMoonSign), description: "Family welfare & prosperity" },
    { name: "Nadi", maxPoints: 8, score: nadiScore(boyNak.index, girlNak.index), description: "Health & genetic compatibility" },
  ];

  const totalScore = koots.reduce((sum, k) => sum + k.score, 0);
  const percentage = Math.round((totalScore / 36) * 100);

  // Manglik check: Mars in 1, 4, 7, 8, 12 house
  const manglikHouses = [1, 4, 7, 8, 12];
  const manglikBoy = boyMarsHouse !== undefined && manglikHouses.includes(boyMarsHouse);
  const manglikGirl = girlMarsHouse !== undefined && manglikHouses.includes(girlMarsHouse);

  let manglikMatch = "No Manglik Dosha detected for either partner.";
  if (manglikBoy && manglikGirl) manglikMatch = "Both partners are Manglik — this cancels out the dosha. Compatible.";
  else if (manglikBoy) manglikMatch = "Boy is Manglik, Girl is not. This may need remedies.";
  else if (manglikGirl) manglikMatch = "Girl is Manglik, Boy is not. This may need remedies.";

  let verdict: string;
  let recommendation: string;
  if (totalScore >= 25) {
    verdict = "Excellent Match ✨";
    recommendation = "Highly auspicious for marriage. The couple will share deep understanding, mutual respect, and lasting harmony.";
  } else if (totalScore >= 18) {
    verdict = "Good Match ✅";
    recommendation = "A good match for marriage. Minor differences can be managed with understanding and communication.";
  } else if (totalScore >= 12) {
    verdict = "Average Match ⚠️";
    recommendation = "Average compatibility. Some adjustments needed. Consider consulting an astrologer for remedies.";
  } else {
    verdict = "Below Average ❌";
    recommendation = "Low compatibility score. Significant differences may arise. Strong remedies and counseling recommended.";
  }

  return { totalScore, maxScore: 36, percentage, verdict, koots, manglikBoy, manglikGirl, manglikMatch, recommendation };
}
