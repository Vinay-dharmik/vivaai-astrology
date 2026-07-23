/**
 * Rashi-to-rashi compatibility using the classical Vedic method.
 *
 * The previous implementation scored pairs on Western element theory alone,
 * which produced only three blocks of text shared across all 144 pairings.
 * This computes the two factors the Ashtakoota system actually uses at the
 * rashi level — Bhakoot (the mutual position of the two signs) and Graha
 * Maitri (natural friendship between the two sign lords) — so each pairing
 * is described by what is genuinely different about it.
 */

import { RASHI } from "./constants";

/** Naisargika Maitri — the natural, permanent friendship table. */
const FRIENDS: Record<string, string[]> = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mercury"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"],
};

const ENEMIES: Record<string, string[]> = {
  Sun: ["Venus", "Saturn"],
  Moon: [],
  Mars: ["Mercury"],
  Mercury: ["Moon"],
  Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"],
  Saturn: ["Sun", "Moon", "Mars"],
};

export type Maitri = "Friends" | "Neutral" | "Enemies" | "Same lord";

export function grahaMaitri(lordA: string, lordB: string): Maitri {
  if (lordA === lordB) return "Same lord";
  if (FRIENDS[lordA]?.includes(lordB) && FRIENDS[lordB]?.includes(lordA)) return "Friends";
  if (ENEMIES[lordA]?.includes(lordB) && ENEMIES[lordB]?.includes(lordA)) return "Enemies";
  if (ENEMIES[lordA]?.includes(lordB) || ENEMIES[lordB]?.includes(lordA)) return "Enemies";
  if (FRIENDS[lordA]?.includes(lordB) || FRIENDS[lordB]?.includes(lordA)) return "Friends";
  return "Neutral";
}

/**
 * Bhakoot — the mutual axis between two rashis. Classical Ashtakoota awards
 * zero of seven points to the 2/12, 5/9 and 6/8 axes; the rest score full.
 */
export interface BhakootResult {
  axis: string;
  points: number;
  dosha: boolean;
  name: string;
  meaning: string;
}

function bhakoot(countAtoB: number): BhakootResult {
  const countBtoA = countAtoB === 1 ? 1 : 14 - countAtoB;
  const pair = [countAtoB, countBtoA].sort((a, b) => a - b);
  const axis = `${pair[0]}/${pair[1]}`;

  switch (axis) {
    case "1/1":
      return {
        axis, points: 7, dosha: false, name: "Same rashi",
        meaning: "Both partners occupy the same sign, so temperament, pace and priorities line up almost automatically. Understanding is immediate; the risk is that shared blind spots go unchallenged because neither person sees them.",
      };
    case "3/11":
      return {
        axis, points: 7, dosha: false, name: "Sahaja–Labha axis",
        meaning: "The 3/11 axis links initiative to gain. One partner supplies drive and the other converts it into results, which makes this one of the most materially productive pairings — the relationship tends to make both people more effective than they were alone.",
      };
    case "4/10":
      return {
        axis, points: 7, dosha: false, name: "Kendra (Sukha–Karma) axis",
        meaning: "Home on one side, career and public standing on the other. This is the classic householder pairing: one partner anchors domestic life while the other builds outward reputation. It divides labour naturally and is very stable, provided both roles are genuinely valued.",
      };
    case "7/7":
      return {
        axis, points: 7, dosha: false, name: "Samasaptaka (mutual 7th)",
        meaning: "Each sign falls in the other's 7th house — the house of marriage itself, viewed from both sides. This is the axis of complete opposites who complete each other. Attraction is strong and the pairing is classically favoured for marriage, though the very polarity that attracts also produces the sharpest disagreements.",
      };
    case "2/12":
      return {
        axis, points: 0, dosha: true, name: "Dwirdwadasha Bhakoot Dosha",
        meaning: "One sign sits in the 2nd from the other and the 12th in return — wealth on one side, expenditure on the other. Classically this indicates financial drain and an imbalance in giving: one partner tends to spend what the other accumulates. It is the mildest of the three Bhakoot doshas and is generally workable with financial transparency.",
      };
    case "5/9":
      return {
        axis, points: 0, dosha: true, name: "Navam-Pancham Bhakoot Dosha",
        meaning: "The 5/9 axis is auspicious in most contexts — it links dharma and progeny — but Ashtakoota still scores it zero for Bhakoot, traditionally because of concerns around children and lineage. In practice the emotional and intellectual rapport in this pairing is usually excellent, and the dosha is considered cancellable when Graha Maitri is strong.",
      };
    case "6/8":
      return {
        axis, points: 0, dosha: true, name: "Shadashtaka Bhakoot Dosha",
        meaning: "The 6/8 axis is the most serious of the three. One sign falls in the other's 6th house of conflict, debt and illness, and the 8th of upheaval in return. Classically it indicates friction, health concerns and unexpected disruption. This pairing needs real remedial attention and a full birth-chart match rather than a rashi-level reading.",
      };
    default:
      return {
        axis, points: 7, dosha: false, name: `${axis} axis`,
        meaning: "This axis carries no classical Bhakoot affliction. The relationship's character is set more by the friendship between the two sign lords than by the positional relationship itself.",
      };
  }
}

const MAITRI_TEXT: Record<Maitri, { love: string; work: string }> = {
  "Same lord": {
    love: "Both signs answer to the same graha, so the underlying motivation is identical. This produces unusual ease — you want the same things for the same reasons — but also means neither partner naturally supplies what the other lacks.",
    work: "Working together is frictionless because you assess situations the same way. The blind spot is that you will also both miss the same things.",
  },
  Friends: {
    love: "The two sign lords are natural friends, which is the single most favourable factor at this level of matching. Affection comes easily, disagreements resolve without residue, and the relationship recovers well from strain.",
    work: "Professionally this pairing cooperates without needing to negotiate every decision. Trust is the default rather than something that has to be built.",
  },
  Neutral: {
    love: "The sign lords are neutral to each other — neither drawn together nor in conflict. The relationship becomes what the two people actively make of it, with little help or hindrance from the underlying planetary friendship.",
    work: "A workable professional pairing that depends on clearly defined roles. Nothing is automatic here, in either direction.",
  },
  Enemies: {
    love: "The two sign lords are natural enemies, which shows up as a persistent difference in what each partner considers important. Attraction can still be strong, but the friction is structural rather than situational and does not disappear with familiarity.",
    work: "Working together requires explicit agreements and separate domains. Left informal, this combination reliably produces territorial disputes.",
  },
};

export interface SignCompatResult {
  a: string;
  b: string;
  score: number;
  bhakoot: BhakootResult;
  maitri: Maitri;
  lordA: string;
  lordB: string;
  sameElement: boolean;
  love: string;
  friendship: string;
  work: string;
  challenges: string;
  verdict: string;
}

export function getSignCompat(signA: string, signB: string): SignCompatResult {
  const slugs = RASHI.map((r) => r.english.toLowerCase());
  const ia = slugs.indexOf(signA.toLowerCase());
  const ib = slugs.indexOf(signB.toLowerCase());
  const A = RASHI[ia];
  const B = RASHI[ib];

  const count = ((ib - ia + 12) % 12) + 1;
  const bk = bhakoot(count);
  const mt = grahaMaitri(A.lord, B.lord);
  const sameElement = A.element === B.element;

  // Bhakoot is worth 7 points and Graha Maitri 5 in Ashtakoota; scale that
  // 12-point subtotal to a percentage and adjust slightly for element.
  const maitriPoints = mt === "Same lord" || mt === "Friends" ? 5 : mt === "Neutral" ? 3 : 0;
  const raw = bk.points + maitriPoints;
  const score = Math.round((raw / 12) * 78) + (sameElement ? 12 : 8);

  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const nameA = cap(A.english);
  const nameB = cap(B.english);

  const love = `${nameA} and ${nameB} form a ${bk.axis} Bhakoot. ${bk.meaning} ${MAITRI_TEXT[mt].love}`;

  const friendship = `As friends, ${nameA} (${A.name}, ruled by ${A.lord}) and ${nameB} (${B.name}, ruled by ${B.lord}) relate through ${
    mt === "Enemies"
      ? "a lord relationship that is naturally adversarial, so the friendship usually needs a shared external interest to hold it together"
      : mt === "Neutral"
      ? "neutral lords, meaning the friendship grows on shared circumstance rather than instinctive affinity"
      : "friendly lords, which makes easy, long-running companionship the norm"
  }. ${
    sameElement
      ? `Both are ${A.element} signs, so their instinctive pace and priorities match.`
      : `${A.element} and ${B.element} bring different tempos — ${nameA} approaches things through ${elementStyle(A.element)}, ${nameB} through ${elementStyle(B.element)}.`
  }`;

  const work = `${MAITRI_TEXT[mt].work} ${
    bk.dosha
      ? `The ${bk.name} also applies here, and in a business context it tends to surface as disputes over money and credit rather than as personal conflict. Put the terms in writing.`
      : `The ${bk.name} supports joint ventures — this is a positional relationship that classical texts read as productive.`
  }`;

  const challenges = bk.dosha
    ? `${bk.name} is the main obstacle in this match. ${
        mt === "Friends" || mt === "Same lord"
          ? `The friendly relationship between ${A.lord} and ${B.lord} does meaningfully offset it — classical texts treat strong Graha Maitri as a partial cancellation of Bhakoot Dosha — but a full Kundali match is genuinely necessary before a marriage decision.`
          : `With ${A.lord} and ${B.lord} also ${mt === "Enemies" ? "in natural enmity" : "neutral"}, there is no cancelling factor at this level. This pairing should not be assessed on rashi alone.`
      }`
    : `There is no Bhakoot Dosha between these signs. ${
        mt === "Enemies"
          ? `The real friction is the enmity between ${A.lord} and ${B.lord}, which shows up as a recurring difference in values rather than open conflict.`
          : `The remaining variables are individual — Mangal Dosha, Nadi and the Dasha periods each partner is running — none of which a sun-sign comparison can see.`
      }`;

  const verdict =
    score >= 78 ? "Strongly compatible" : score >= 62 ? "Compatible with effort" : score >= 48 ? "Mixed — needs a full chart match" : "Challenging";

  return {
    a: nameA, b: nameB, score, bhakoot: bk, maitri: mt,
    lordA: A.lord, lordB: B.lord, sameElement,
    love, friendship, work, challenges, verdict,
  };
}

function elementStyle(element: string): string {
  switch (element) {
    case "Fire": return "initiative and momentum";
    case "Earth": return "practicality and accumulation";
    case "Air": return "ideas and communication";
    default: return "feeling and intuition";
  }
}
