/**
 * A written report for each planet in a chart.
 *
 * Not a lookup of "Mars in the 4th house" paragraphs. Every sentence here is
 * assembled from facts already computed for *this* chart — which houses the
 * planet rules from this Ascendant, whether it is functionally benefic here,
 * its Shadbala against Parashara's required minimum, its own Ashtakavarga
 * bindus in the sign it occupies, its dignity, motion, and combustion.
 *
 * Two people with Mars in the 4th house get different reports, because for one
 * of them Mars may rule the 1st and 8th and be exalted, and for the other rule
 * the 3rd and 10th and be burnt by the Sun.
 */

import type { PlanetStrength } from "./shadbala";
import { bhinnaVerdict } from "./ashtakavarga";

// ── Reference data ────────────────────────────────────────

const SIGN_LORD: string[] = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

const SIGN_NAME = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

/** What each planet signifies as a natural karaka. */
const KARAKA: Record<string, string> = {
  Sun: "the soul, vitality, the father, authority and public standing",
  Moon: "the mind, emotional weather, the mother, the general public and comfort",
  Mars: "drive, courage, brothers, land, surgery and anything won by force",
  Mercury: "intellect, speech, commerce, calculation, nerves and the written word",
  Jupiter: "wisdom, teachers, children, wealth, dharma and expansion",
  Venus: "love, marriage, beauty, vehicles, luxury and artistic sense",
  Saturn: "time, discipline, labour, longevity, sorrow and slow-earned mastery",
  Rahu: "obsession, foreign things, sudden rise, illusion and unconventional gain",
  Ketu: "detachment, past merit, moksha, sharp insight and sudden loss",
};

/** The concise nature of each planet, used when describing what it gives. */
const GIVES: Record<string, string> = {
  Sun: "recognition, confidence and the willingness to lead",
  Moon: "receptivity, popularity and emotional intelligence",
  Mars: "initiative, physical stamina and the nerve to act first",
  Mercury: "quick analysis, persuasion and commercial instinct",
  Jupiter: "good counsel, protection, optimism and expansion",
  Venus: "charm, harmony, comfort and an eye for quality",
  Saturn: "patience, structure, endurance and authority earned slowly",
  Rahu: "ambition, novelty and the appetite to break convention",
  Ketu: "concentration, renunciation and a talent that needs no teacher",
};

/** What a weakened version of each planet fails to supply. */
const WITHHOLDS: Record<string, string> = {
  Sun: "self-assurance, and recognition that arrives late or from the wrong people",
  Moon: "emotional steadiness, restful sleep and easy rapport",
  Mars: "follow-through — plenty of starts, few finishes",
  Mercury: "clarity in speech and judgement under pressure",
  Jupiter: "guidance, good timing and the sense that someone is looking out for you",
  Venus: "ease in relationships and pleasure in what has been earned",
  Saturn: "stamina for the long haul, and reward proportional to effort",
  Rahu: "focus — ambition that scatters across too many objects",
  Ketu: "engagement — withdrawal from things that still need attention",
};

const HOUSE_TOPIC: Record<number, string> = {
  1: "your body, temperament and how you come across",
  2: "savings, family, speech and what you accumulate",
  3: "initiative, younger siblings, communication and short travel",
  4: "home, mother, land, vehicles and inner peace",
  5: "children, intelligence, romance, speculation and past merit",
  6: "work routine, health, debt, competition and adversaries",
  7: "marriage, partnership and dealings with others",
  8: "upheaval, inheritance, joint finances, longevity and hidden matters",
  9: "fortune, father, teachers, belief and long journeys",
  10: "career, status and public action",
  11: "income, gains, networks and elder siblings",
  12: "expenditure, foreign residence, solitude and release",
};

/** Classical Yogakaraka planets — one planet ruling both a kendra and a trikona. */
const YOGAKARAKA: Record<number, string> = {
  3: "Mars",    // Cancer lagna
  4: "Mars",    // Leo
  1: "Saturn",  // Taurus
  6: "Saturn",  // Libra
  9: "Venus",   // Capricorn
  10: "Venus",  // Aquarius
};

const NATURAL_BENEFIC = new Set(["Jupiter", "Venus", "Mercury", "Moon"]);

// ── Functional nature ─────────────────────────────────────

const KENDRAS = [1, 4, 7, 10];
const TRIKONAS = [1, 5, 9];
const DUSTHANAS = [6, 8, 12];

export interface Rulership {
  houses: number[];
  /** Functional standing of the planet for this Ascendant. */
  nature: "Yogakaraka" | "Functional benefic" | "Neutral" | "Functional malefic";
  reason: string;
}

/** Which houses a planet rules from a given Ascendant, and what that makes it. */
export function rulershipFor(planet: string, lagnaSignIndex: number): Rulership {
  const houses: number[] = [];
  for (let h = 1; h <= 12; h++) {
    if (SIGN_LORD[(lagnaSignIndex + h - 1) % 12] === planet) houses.push(h);
  }

  if (houses.length === 0) {
    // Rahu and Ketu own no sign; they act for whoever hosts them.
    return {
      houses,
      nature: "Neutral",
      reason: `${planet} rules no sign. It takes on the affairs of the house it sits in and of its dispositor.`,
    };
  }

  if (YOGAKARAKA[lagnaSignIndex] === planet) {
    return {
      houses,
      nature: "Yogakaraka",
      reason: `For ${SIGN_NAME[lagnaSignIndex]} Ascendant, ${planet} rules both an angle and a trine (houses ${houses.join(" and ")}). Parashara treats a single planet holding both as the chart's most reliable source of good — its periods tend to be the ones that actually move your life.`,
    };
  }

  const hasTrikona = houses.some((h) => TRIKONAS.includes(h));
  const hasKendra = houses.some((h) => KENDRAS.includes(h));
  const hasDusthana = houses.some((h) => DUSTHANAS.includes(h));

  if (hasTrikona && !hasDusthana) {
    return {
      houses,
      nature: "Functional benefic",
      reason: `${planet} rules house ${houses.join(" and ")} from your Ascendant. A trine lord is a functional benefic regardless of the planet's natural temperament — even Saturn or Mars protects when it owns a trine.`,
    };
  }

  if (hasDusthana && !hasTrikona) {
    const dust = houses.filter((h) => DUSTHANAS.includes(h));
    return {
      houses,
      nature: "Functional malefic",
      reason: `${planet} rules house ${houses.join(" and ")}, including the ${dust.join(" and ")}. Lords of the 6th, 8th and 12th carry the difficulties of those houses into wherever they sit, and their periods usually ask something of you before they give.`,
    };
  }

  if (hasKendra && NATURAL_BENEFIC.has(planet)) {
    return {
      houses,
      nature: "Neutral",
      reason: `${planet} rules the angular house ${houses.join(" and ")}. Kendradhipatya Dosha applies: a natural benefic owning only angles loses some of its power to bless, though it does not turn harmful.`,
    };
  }

  if (hasKendra) {
    return {
      houses,
      nature: "Functional benefic",
      reason: `${planet} rules the angular house ${houses.join(" and ")}. A natural malefic owning an angle sheds much of its harshness — the reverse of the rule that applies to benefics.`,
    };
  }

  return {
    houses,
    nature: "Neutral",
    reason: `${planet} rules house ${houses.join(" and ")} from your Ascendant, neither trine nor angle nor dusthana.`,
  };
}

// ── Report ────────────────────────────────────────────────

export interface PlanetReportInput {
  planet: string;
  /** Ascendant sign index — passed explicitly rather than back-derived. */
  lagnaSignIndex: number;
  signIndex: number;
  signDegree: number;
  house: number;
  dignity: string;
  isRetrograde: boolean;
  isCombust: boolean;
  nakshatra: string;
  nakshatraPada: number;
  /** Absent for Rahu and Ketu, which Shadbala does not score. */
  strength?: PlanetStrength;
  /** This planet's own Ashtakavarga bindus in the sign it occupies. */
  ownBindus?: number;
  /** Sarvashtakavarga total for the sign it occupies. */
  sarvaBindus?: number;
  /** Planets casting a strong aspect on this one. */
  aspectedBy: string[];
  /** Current Mahadasha lord, so timing can be stated. */
  currentDashaLord: string;
}

export interface PlanetReport {
  planet: string;
  headline: string;
  rulership: Rulership;
  placement: string;
  significations: string;
  strengths: string[];
  weaknesses: string[];
  effects: string[];
  timing: string;
  remedy: string;
  /** 0–100, for the strength bar. */
  score: number;
}

const REMEDY: Record<string, string> = {
  Sun: "Offer water to the rising Sun with a copper vessel on Sundays, and recite the Aditya Hridayam. Respect toward your father or a father-figure does more for a weak Sun than any gemstone.",
  Moon: "Keep a regular sleep hour and eat at fixed times — an unsettled Moon is destabilised more by disorder than by planets. Monday fasting and offering white rice or milk are the classical supports.",
  Mars: "Give the energy an outlet before it finds one: hard physical training, early in the day. Recite the Hanuman Chalisa on Tuesdays. Avoid deciding anything important while angry.",
  Mercury: "Write by hand daily, however briefly. Feed green fodder to cows on Wednesdays and recite the Vishnu Sahasranama. Keep commitments small enough to actually keep.",
  Jupiter: "Teach something to someone without charging for it. Thursday fasting, offering turmeric or yellow cloth, and genuine deference to a teacher are the classical remedies.",
  Venus: "Friday observance, offering white flowers or curd. Beyond ritual: attend to one relationship properly rather than many carelessly, and keep your surroundings clean and pleasant.",
  Saturn: "Saturday service to labourers, the elderly or the disabled — Saturn is appeased by work done for those who cannot repay it. Iron, black sesame and mustard oil are the traditional offerings.",
  Rahu: "Rahu quiets with routine and honesty. Donate mustard oil or a blanket on Saturdays, recite the Durga Saptashati, and refuse shortcuts even when they are available.",
  Ketu: "Feed stray dogs, keep a small daily meditation, and donate multicoloured cloth. Ketu asks for a discipline practised without an audience.",
};

export function buildPlanetReport(input: PlanetReportInput): PlanetReport {
  const {
    planet, lagnaSignIndex, signIndex, signDegree, house, dignity,
    isRetrograde, isCombust, nakshatra, nakshatraPada, strength,
    ownBindus, sarvaBindus, aspectedBy, currentDashaLord,
  } = input;

  const rulership = rulershipFor(planet, lagnaSignIndex);

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const effects: string[] = [];

  // ── Dignity ──
  if (dignity.startsWith("Exalted")) {
    strengths.push(`Exalted in ${SIGN_NAME[signIndex]}. This is ${planet} at its most capable — what it signifies tends to arrive in good quality and without your having to fight for it.`);
  } else if (dignity.startsWith("Own")) {
    strengths.push(`In its own sign ${SIGN_NAME[signIndex]}. ${planet} is at home here: comfortable, unforced, and able to protect the house it occupies.`);
  } else if (dignity.startsWith("Debilitated")) {
    weaknesses.push(`Debilitated in ${SIGN_NAME[signIndex]}. ${planet} is working against the grain of its host sign, so its results come late, in reduced form, or only after repeated effort.`);
  } else if (dignity.startsWith("Vargottama")) {
    strengths.push(`Vargottama — the same sign in D1 and D9. A placement that holds up under examination; what this planet promises in the birth chart is confirmed in the ninth harmonic rather than contradicted by it.`);
  }

  // ── Shadbala ──
  if (strength) {
    const pct = Math.round(strength.ratio * 100);
    if (strength.ratio >= 1.1) {
      strengths.push(`Shadbala ${strength.totalRupas.toFixed(2)} Rupas against a required ${strength.requiredRupas} — ${pct}% of minimum, ranked ${ordinal(strength.rank)} strongest in your chart. It has the resources to deliver what it rules.`);
    } else if (strength.ratio >= 0.9) {
      strengths.push(`Shadbala ${strength.totalRupas.toFixed(2)} Rupas against a required ${strength.requiredRupas} — just at the threshold. Sufficient, but with no margin: this planet performs when supported and falters when pressed.`);
    } else {
      weaknesses.push(`Shadbala ${strength.totalRupas.toFixed(2)} Rupas against Parashara's required ${strength.requiredRupas} — only ${pct}% of the minimum. A planet below its required strength still signifies its matters, but it cannot bring them about on its own schedule.`);
    }

    // Name the weakest component so the number is actionable.
    const b = strength.breakdown;
    const parts: [string, number][] = [
      ["positional (Sthana)", b.sthanaTotal / 5],
      ["directional (Dig)", b.dig],
      ["temporal (Kala)", b.kalaTotal / 5],
      ["motional (Cheshta)", b.cheshta],
    ];
    const weakest = parts.reduce((a, c) => (c[1] < a[1] ? c : a));
    const strongest = parts.reduce((a, c) => (c[1] > a[1] ? c : a));
    effects.push(`Its strength comes mostly from ${strongest[0]} placement and least from ${weakest[0]}.`);
  }

  // ── Ashtakavarga ──
  if (ownBindus !== undefined) {
    const v = bhinnaVerdict(ownBindus);
    const line = `${ownBindus} of a possible 8 bindus in its own Ashtakavarga for ${SIGN_NAME[signIndex]} — ${v.label.toLowerCase()}.`;
    if (v.tone === "good") strengths.push(line);
    else weaknesses.push(line);
  }
  if (sarvaBindus !== undefined) {
    effects.push(`The sign it occupies carries ${sarvaBindus} Sarvashtakavarga bindus, which is ${sarvaBindus >= 29 ? "above" : sarvaBindus >= 25 ? "around" : "below"} the average of 28 — a measure of how much overall support this area of your chart receives.`);
  }

  // ── Motion and combustion ──
  if (isRetrograde) {
    strengths.push(`Retrograde. Classical texts give a retrograde planet full Cheshta Bala: it is unusually insistent, and its matters tend to be revisited rather than resolved on first attempt. Results often arrive out of the expected order.`);
  }
  if (isCombust) {
    weaknesses.push(`Combust — too close to the Sun to act in its own right. Its significations get absorbed into matters of ego, authority and the father, and it works better behind someone else's initiative than at the front of your own.`);
  }

  // ── Functional nature ──
  if (rulership.nature === "Yogakaraka") {
    strengths.push(rulership.reason);
  } else if (rulership.nature === "Functional malefic") {
    weaknesses.push(rulership.reason);
  } else {
    effects.push(rulership.reason);
  }

  // ── House placement ──
  effects.push(`Placed in house ${house}, it directs ${GIVES[planet]} toward ${HOUSE_TOPIC[house]}.`);
  if (rulership.houses.length > 0) {
    const carried = rulership.houses.map((h) => `house ${h}`).join(" and ");
    effects.push(`Because it rules ${carried}, matters of ${carried.replace(/house (\d+)/g, (_, n) => HOUSE_TOPIC[Number(n)])} are brought into house ${house} and coloured by it.`);
  }

  // ── Aspects ──
  if (aspectedBy.length > 0) {
    const benefics = aspectedBy.filter((p) => NATURAL_BENEFIC.has(p));
    const malefics = aspectedBy.filter((p) => !NATURAL_BENEFIC.has(p));
    if (benefics.length) {
      strengths.push(`Aspected by ${listOf(benefics)}. Benefic sight steadies a planet and softens whatever difficulty its placement carries.`);
    }
    if (malefics.length) {
      weaknesses.push(`Aspected by ${listOf(malefics)}. Malefic sight adds friction: results still come, but with more resistance and less comfort than the placement alone suggests.`);
    }
  } else {
    effects.push(`No planet casts a close aspect on it, so it acts largely on its own terms — neither rescued nor obstructed by the rest of the chart.`);
  }

  // ── Nakshatra ──
  effects.push(`It occupies ${nakshatra} pada ${nakshatraPada} at ${formatDeg(signDegree)} of ${SIGN_NAME[signIndex]}, which is the finer address behind the sign and the basis of its Dasha sequence.`);

  // ── Timing ──
  const timing = currentDashaLord === planet
    ? `You are running the ${planet} Mahadasha now, so this planet is not background material — it is the current chapter. Everything described above is being expressed rather than waiting.`
    : `${planet} is not your current Mahadasha lord; ${currentDashaLord} is. This planet's material stays largely latent until its own Mahadasha or Antardasha, and reads as background influence in the meantime.`;

  // ── Headline & score ──
  const score = strength
    ? Math.max(4, Math.min(100, Math.round(strength.ratio * 62)))
    : Math.max(4, Math.min(100, ((ownBindus ?? 4) / 8) * 100));

  const verdict = strength?.verdict ?? (isCombust ? "Weak" : "Adequate");
  const headline = `${planet} is ${verdict.toLowerCase()} in this chart — ${
    rulership.nature === "Yogakaraka" ? "and it is your Yogakaraka, which makes it the single most important planet to strengthen"
    : rulership.nature === "Functional malefic" ? "and it rules difficult houses, so its periods ask for care"
    : `ruling ${rulership.houses.length ? rulership.houses.map((h) => `house ${h}`).join(" and ") : "no sign"}`
  }.`;

  return {
    planet,
    headline,
    rulership,
    placement: `${SIGN_NAME[signIndex]} ${formatDeg(signDegree)}, house ${house}${isRetrograde ? ", retrograde" : ""}${isCombust ? ", combust" : ""}${dignity && dignity !== "Normal" ? `, ${dignity.replace(/[⬆⬇★✦]/g, "").trim().toLowerCase()}` : ""}`,
    significations: `${planet} signifies ${KARAKA[planet]}. Strong, it supplies ${GIVES[planet]}. Weak, it withholds ${WITHHOLDS[planet]}.`,
    strengths,
    weaknesses,
    effects,
    timing,
    remedy: REMEDY[planet],
    score,
  };
}

// ── Formatting helpers ────────────────────────────────────

function formatDeg(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.round((deg - d) * 60);
  return m === 60 ? `${d + 1}°00′` : `${d}°${String(m).padStart(2, "0")}′`;
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function listOf(items: string[]): string {
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
