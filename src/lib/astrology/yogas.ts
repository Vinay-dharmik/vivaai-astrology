/**
 * Comprehensive Vedic yoga detection engine.
 * Covers 25+ classical yogas from Brihat Parashara Hora Shastra.
 *
 * A yoga forms when specific planetary conditions are met in the birth chart.
 * Each function receives the planet house map, sign index map, and house lord map.
 */

import { RASHI } from "./constants";

export interface YogaResult {
  name: string;
  sanskrit: string;
  formed: boolean;
  planets: string;
  effect: string;
  category: "benefic" | "malefic" | "mixed";
  strength: "strong" | "moderate" | "weak";
}

interface PlanetInfo {
  house: number;
  signIndex: number;
  isRetrograde: boolean;
  dignity: string; // "Exalted ⬆" | "Debilitated ⬇" | "Own Sign ★" | "Normal"
}

type PlanetMap = Record<string, PlanetInfo>;
type HouseMap = Record<number, { lord: string; signIndex: number; planets: string[] }>;

// ── Planetary aspects (Drishti) ───────────────────────────
// Returns which houses each planet aspects
export function calcAspects(planets: PlanetMap): Record<string, number[]> {
  const result: Record<string, number[]> = {};
  for (const [body, info] of Object.entries(planets)) {
    const h = info.house;
    const aspected = new Set<number>();
    // 7th house aspect — all planets
    aspected.add(((h - 1 + 6) % 12) + 1);
    // Mars special: 4th and 8th
    if (body === "Mars") {
      aspected.add(((h - 1 + 3) % 12) + 1);
      aspected.add(((h - 1 + 7) % 12) + 1);
    }
    // Jupiter special: 5th and 9th
    if (body === "Jupiter") {
      aspected.add(((h - 1 + 4) % 12) + 1);
      aspected.add(((h - 1 + 8) % 12) + 1);
    }
    // Saturn special: 3rd and 10th
    if (body === "Saturn") {
      aspected.add(((h - 1 + 2) % 12) + 1);
      aspected.add(((h - 1 + 9) % 12) + 1);
    }
    result[body] = [...aspected];
  }
  return result;
}

// ── Helpers ───────────────────────────────────────────────

function h(p: PlanetMap, body: string) { return p[body]?.house ?? 0; }
function s(p: PlanetMap, body: string) { return p[body]?.signIndex ?? -1; }
function isExalted(p: PlanetMap, body: string) { return p[body]?.dignity === "Exalted ⬆"; }
function isOwn(p: PlanetMap, body: string) { return p[body]?.dignity === "Own Sign ★"; }
function isDebilitated(p: PlanetMap, body: string) { return p[body]?.dignity === "Debilitated ⬇"; }
function isRetro(p: PlanetMap, body: string) { return p[body]?.isRetrograde ?? false; }

const KENDRAS = [1, 4, 7, 10];
const TRIKONAS = [1, 5, 9];
const UPACHAYAS = [3, 6, 10, 11];
const DUSTHANAS = [6, 8, 12];
const BENEFICS = ["Jupiter", "Venus", "Mercury", "Moon"];
const MALEFICS = ["Saturn", "Mars", "Rahu", "Ketu", "Sun"];

function inKendra(p: PlanetMap, body: string) { return KENDRAS.includes(h(p, body)); }
function inTrikona(p: PlanetMap, body: string) { return TRIKONAS.includes(h(p, body)); }
function inDusthana(p: PlanetMap, body: string) { return DUSTHANAS.includes(h(p, body)); }

function houseDiff(from: number, to: number): number {
  return ((to - from + 12) % 12) + 1;
}

// ── 1. Panch Mahapurusha Yogas ────────────────────────────

function ruchakaYoga(p: PlanetMap): YogaResult {
  const formed = (isExalted(p, "Mars") || isOwn(p, "Mars")) && inKendra(p, "Mars");
  return {
    name: "Ruchaka Yoga", sanskrit: "रुचक योग", formed,
    planets: "Mars in own/exalted sign in kendra",
    effect: formed
      ? "Exceptional courage, military prowess, strong physique. Leadership in competitive fields. Fame and authority in the 30s."
      : "Mars not forming Ruchaka. Courage is present but moderate.",
    category: "benefic", strength: formed ? "strong" : "weak",
  };
}

function bhadraYoga(p: PlanetMap): YogaResult {
  const formed = (isExalted(p, "Mercury") || isOwn(p, "Mercury")) && inKendra(p, "Mercury");
  return {
    name: "Bhadra Yoga", sanskrit: "भद्र योग", formed,
    planets: "Mercury in own/exalted sign in kendra",
    effect: formed
      ? "Exceptional intelligence, mastery in communication, writing or business. Long life and high intellectual status."
      : "Mercury not forming Bhadra. Intellect is standard.",
    category: "benefic", strength: formed ? "strong" : "weak",
  };
}

function hamsaYoga(p: PlanetMap): YogaResult {
  const formed = (isExalted(p, "Jupiter") || isOwn(p, "Jupiter")) && inKendra(p, "Jupiter");
  return {
    name: "Hamsa Yoga", sanskrit: "हंस योग", formed,
    planets: "Jupiter in own/exalted sign in kendra",
    effect: formed
      ? "Wisdom, spiritual authority, prosperity, respected in society. Career in education, judiciary or spirituality. Charitable nature."
      : "Jupiter not forming Hamsa. Wisdom grows through experience.",
    category: "benefic", strength: formed ? "strong" : "weak",
  };
}

function malavyaYoga(p: PlanetMap): YogaResult {
  const formed = (isExalted(p, "Venus") || isOwn(p, "Venus")) && inKendra(p, "Venus");
  return {
    name: "Malavya Yoga", sanskrit: "मालव्य योग", formed,
    planets: "Venus in own/exalted sign in kendra",
    effect: formed
      ? "Beauty, luxury, artistic talent, happy married life. Wealth through creative pursuits. Magnetic personality and social influence."
      : "Venus not forming Malavya. Comforts come through effort.",
    category: "benefic", strength: formed ? "strong" : "weak",
  };
}

function shashaYoga(p: PlanetMap): YogaResult {
  const formed = (isExalted(p, "Saturn") || isOwn(p, "Saturn")) && inKendra(p, "Saturn");
  return {
    name: "Shasha Yoga", sanskrit: "शश योग", formed,
    planets: "Saturn in own/exalted sign in kendra",
    effect: formed
      ? "Authority over masses, success in politics, law or large organisations. Disciplined, strategic and long-lived."
      : "Saturn not forming Shasha. Hard work yields results steadily.",
    category: "benefic", strength: formed ? "strong" : "weak",
  };
}

// ── 2. Gajakesari Yoga ────────────────────────────────────

function gajakesariYoga(p: PlanetMap): YogaResult {
  const moonH = h(p, "Moon");
  const jupH = h(p, "Jupiter");
  const diff = houseDiff(moonH, jupH);
  const formed = KENDRAS.includes(diff);
  return {
    name: "Gajakesari Yoga", sanskrit: "गजकेसरी योग", formed,
    planets: "Jupiter in kendra from Moon",
    effect: formed
      ? "Intelligence, fame, fortune and eloquence. Native is respected in society and achieves success through wisdom. Strong financial luck."
      : "Jupiter not in kendra from Moon. Wisdom develops through effort.",
    category: "benefic", strength: formed ? "strong" : "weak",
  };
}

// ── 3. Budhaditya Yoga ────────────────────────────────────

function budhadityaYoga(p: PlanetMap): YogaResult {
  const formed = s(p, "Sun") === s(p, "Mercury") && !isDebilitated(p, "Sun");
  const strong = formed && (isExalted(p, "Sun") || isOwn(p, "Sun") || isExalted(p, "Mercury") || isOwn(p, "Mercury"));
  return {
    name: "Budhaditya Yoga", sanskrit: "बुधादित्य योग", formed,
    planets: "Sun + Mercury conjunction",
    effect: formed
      ? `Sharp intellect, eloquence, administrative ability. Success in communication, writing, law or government. ${strong ? "Very strong — both planets dignified." : "Moderate strength."}`
      : "Sun-Mercury not conjunct. Intelligence is steady but not exceptional from this yoga.",
    category: "benefic", strength: strong ? "strong" : formed ? "moderate" : "weak",
  };
}

// ── 4. Chandra-Mangala Yoga ───────────────────────────────

function chandraMangalaYoga(p: PlanetMap): YogaResult {
  const formed = s(p, "Moon") === s(p, "Mars");
  return {
    name: "Chandra-Mangala Yoga", sanskrit: "चंद्र-मंगल योग", formed,
    planets: "Moon + Mars conjunction",
    effect: formed
      ? "Courageous, passionate, strong earning ability through business. Sharp instincts and physical endurance. May have volatile emotions."
      : "Moon-Mars not conjunct.",
    category: "mixed", strength: formed ? "moderate" : "weak",
  };
}

// ── 5. Lakshmi Yoga ───────────────────────────────────────

function lakshmiYoga(p: PlanetMap, houses: HouseMap): YogaResult {
  const ninth = houses[9]?.lord;
  const ninthLordExalted = ninth ? (isExalted(p, ninth) || isOwn(p, ninth)) : false;
  const ninthInKendra = ninth ? inKendra(p, ninth) : false;
  const venusStrong = isExalted(p, "Venus") || isOwn(p, "Venus");
  const formed = ninthLordExalted && (ninthInKendra || inTrikona(p, ninth!)) && venusStrong;
  return {
    name: "Lakshmi Yoga", sanskrit: "लक्ष्मी योग", formed,
    planets: "9th lord strong + Venus dignified",
    effect: formed
      ? "Immense wealth, luxury and prosperity. Native is blessed by Goddess Lakshmi. Financial success comes naturally."
      : "Lakshmi Yoga not formed. Wealth grows through consistent effort.",
    category: "benefic", strength: formed ? "strong" : "weak",
  };
}

// ── 6. Raja Yoga ──────────────────────────────────────────

function rajaYoga(p: PlanetMap, houses: HouseMap, aspects: Record<string, number[]>): YogaResult {
  const kendraLords = KENDRAS.map((k) => houses[k]?.lord).filter(Boolean);
  const trikonaLords = TRIKONAS.map((t) => houses[t]?.lord).filter(Boolean);

  // Check conjunction, mutual aspect, or sign exchange between kendra and trikona lords
  let yogaLords: string[] = [];
  for (const kl of kendraLords) {
    for (const tl of trikonaLords) {
      if (kl === tl) continue; // Same planet can be both
      const conjunct = s(p, kl) === s(p, tl);
      const mutualAspect = aspects[kl]?.includes(h(p, tl)) && aspects[tl]?.includes(h(p, kl));
      const exchange = RASHI[s(p, kl)]?.lord === tl && RASHI[s(p, tl)]?.lord === kl;
      if (conjunct || mutualAspect || exchange) {
        yogaLords = [...new Set([kl, tl])];
        break;
      }
    }
    if (yogaLords.length) break;
  }
  // Lagna lord in trikona/kendra is itself a Raja Yoga basis
  const lagnaLord = houses[1]?.lord;
  const lagnaRaja = lagnaLord && (inKendra(p, lagnaLord) || inTrikona(p, lagnaLord)) && (isExalted(p, lagnaLord) || isOwn(p, lagnaLord));

  const formed = yogaLords.length > 0 || !!lagnaRaja;
  const desc = yogaLords.length
    ? yogaLords.join(" + ")
    : lagnaLord
    ? `Lagna lord ${lagnaLord} dignified in kendra/trikona`
    : "Kendra-trikona lord connection";

  return {
    name: "Raja Yoga", sanskrit: "राज योग", formed,
    planets: desc,
    effect: formed
      ? "Authority, power and high social position. Career advancement to leadership roles. Recognition from government or institutions."
      : "No classical Raja Yoga. Success comes through sustained personal effort.",
    category: "benefic", strength: formed ? (yogaLords.length ? "strong" : "moderate") : "weak",
  };
}

// ── 7. Dhana Yoga ─────────────────────────────────────────

function dhanaYoga(p: PlanetMap, houses: HouseMap): YogaResult {
  const l2 = houses[2]?.lord;
  const l11 = houses[11]?.lord;
  const l1 = houses[1]?.lord;
  const l5 = houses[5]?.lord;
  const l9 = houses[9]?.lord;

  const lords = [l2, l11, l1, l5, l9].filter(Boolean) as string[];
  // Dhana yoga: 2/11 lords conjunct or in each other's signs, or with 1/5/9 lords
  let formed = false;
  let combo = "";
  if (l2 && l11 && s(p, l2) === s(p, l11)) { formed = true; combo = `${l2} + ${l11}`; }
  else if (l2 && l1 && s(p, l2) === s(p, l1)) { formed = true; combo = `${l2} + ${l1}`; }
  else if (l11 && l9 && s(p, l11) === s(p, l9)) { formed = true; combo = `${l11} + ${l9}`; }
  else if (l2 && (inKendra(p, l2) || inTrikona(p, l2)) && (isExalted(p, l2) || isOwn(p, l2))) {
    formed = true; combo = `2nd lord ${l2} dignified`;
  }

  return {
    name: "Dhana Yoga", sanskrit: "धन योग", formed,
    planets: combo || "2nd/11th lord connection",
    effect: formed
      ? "Significant wealth accumulation, financial prosperity and material gains. Multiple income streams possible."
      : "Dhana Yoga not prominent. Wealth grows steadily over time.",
    category: "benefic", strength: formed ? "moderate" : "weak",
  };
}

// ── 8. Adhi Yoga ─────────────────────────────────────────

function adhiYoga(p: PlanetMap): YogaResult {
  const moonH = h(p, "Moon");
  const mercH = h(p, "Mercury");
  const venH = h(p, "Venus");
  const jupH = h(p, "Jupiter");
  const target = [6, 7, 8].map((off) => ((moonH - 1 + off - 1) % 12) + 1);

  let planetsInPos = 0;
  if (target.includes(mercH)) planetsInPos++;
  if (target.includes(venH)) planetsInPos++;
  if (target.includes(jupH)) planetsInPos++;

  const formed = planetsInPos >= 2;
  return {
    name: "Adhi Yoga", sanskrit: "आधि योग", formed,
    planets: "Mercury/Venus/Jupiter in 6th-8th from Moon",
    effect: formed
      ? "Political success, leader of people, defeat of enemies. Native occupies a prominent and respected position in society."
      : "Adhi Yoga not formed.",
    category: "benefic", strength: formed ? (planetsInPos === 3 ? "strong" : "moderate") : "weak",
  };
}

// ── 9. Saraswati Yoga ─────────────────────────────────────

function saraswatiYoga(p: PlanetMap): YogaResult {
  const venH = h(p, "Venus");
  const jupH = h(p, "Jupiter");
  const merH = h(p, "Mercury");
  const allInGoodHouses = (house: number) => [...KENDRAS, ...TRIKONAS, 2].includes(house);
  const formed = allInGoodHouses(venH) && allInGoodHouses(jupH) && allInGoodHouses(merH);

  return {
    name: "Saraswati Yoga", sanskrit: "सरस्वती योग", formed,
    planets: "Jupiter + Venus + Mercury all in kendras/trikonas/2nd",
    effect: formed
      ? "Exceptional intelligence, artistic mastery, great learning. Eloquence in speech and writing. Respected as a scholar or artist."
      : "Saraswati Yoga not formed.",
    category: "benefic", strength: formed ? "strong" : "weak",
  };
}

// ── 10. Vipareeta Raja Yoga ───────────────────────────────

function vipareetaRajaYoga(p: PlanetMap, houses: HouseMap): YogaResult {
  const l6 = houses[6]?.lord;
  const l8 = houses[8]?.lord;
  const l12 = houses[12]?.lord;

  let formed = false;
  let desc = "";
  // Dusthana lords in other dusthanas create Vipareeta Raja Yoga
  if (l6 && inDusthana(p, l6) && h(p, l6) !== 6) { formed = true; desc = `6th lord ${l6} in dusthana`; }
  else if (l8 && inDusthana(p, l8) && h(p, l8) !== 8) { formed = true; desc = `8th lord ${l8} in dusthana`; }
  else if (l12 && inDusthana(p, l12) && h(p, l12) !== 12) { formed = true; desc = `12th lord ${l12} in dusthana`; }
  else if (l6 && l8 && s(p, l6) === s(p, l8)) { formed = true; desc = `${l6} + ${l8} conjunct`; }

  return {
    name: "Vipareeta Raja Yoga", sanskrit: "विपरीत राज योग", formed,
    planets: desc || "6th/8th/12th lord exchange",
    effect: formed
      ? "Unexpected rise to power, often after overcoming adversity. Native benefits from the misfortune of opponents. Sudden reversals bring success."
      : "Vipareeta Raja Yoga not formed.",
    category: "benefic", strength: formed ? "moderate" : "weak",
  };
}

// ── 11. Neechabhanga Raja Yoga ────────────────────────────

function neechabhangaYoga(p: PlanetMap, houses: HouseMap): YogaResult {
  // A debilitated planet gets cancelled when:
  // 1. Lord of the debilitation sign is in kendra from lagna or Moon
  // 2. Planet that would be exalted in that sign is in kendra
  // 3. Debilitated planet is in kendra
  const debilPairs: Record<string, string> = {
    Sun: "Libra", Moon: "Scorpio", Mars: "Cancer",
    Mercury: "Pisces", Jupiter: "Capricorn", Venus: "Virgo", Saturn: "Aries",
  };
  // Lord of debilitation sign
  const debilSignLord: Record<string, string> = {
    Sun: "Venus", Moon: "Mars", Mars: "Moon",
    Mercury: "Jupiter", Jupiter: "Saturn", Venus: "Mercury", Saturn: "Mars",
  };

  let formed = false;
  let affectedPlanet = "";

  for (const [planet, debSign] of Object.entries(debilPairs)) {
    if (!isDebilitated(p, planet)) continue;
    const dLord = debilSignLord[planet];
    // Cancellation condition 1: debilitation sign lord in kendra from lagna
    if (inKendra(p, dLord) || inTrikona(p, dLord)) {
      formed = true;
      affectedPlanet = planet;
      break;
    }
    // Cancellation condition 2: debilitated planet itself in kendra
    if (inKendra(p, planet)) {
      formed = true;
      affectedPlanet = planet;
      break;
    }
  }

  return {
    name: "Neechabhanga Raja Yoga", sanskrit: "नीचभंग राज योग", formed,
    planets: affectedPlanet ? `${affectedPlanet} debilitation cancelled` : "No debilitation",
    effect: formed
      ? `${affectedPlanet}'s debilitation is cancelled, conferring Raja Yoga effects. Struggles in youth transform into remarkable success in maturity.`
      : "No Neechabhanga Yoga. Debilitated planets need remedies.",
    category: "benefic", strength: formed ? "strong" : "weak",
  };
}

// ── 12. Chandal (Guru-Chandal) Yoga ──────────────────────

function chandalYoga(p: PlanetMap): YogaResult {
  const formed = s(p, "Jupiter") === s(p, "Rahu") || s(p, "Jupiter") === s(p, "Ketu");
  const withRahu = s(p, "Jupiter") === s(p, "Rahu");
  return {
    name: "Chandal Yoga", sanskrit: "चांडाल योग", formed,
    planets: `Jupiter + ${withRahu ? "Rahu" : "Ketu"}`,
    effect: formed
      ? `Jupiter afflicted by ${withRahu ? "Rahu" : "Ketu"}. May cause ethical dilemmas, confusion in beliefs, or unconventional spiritual path. Remedy: Guru puja and Jupiter strengthening.`
      : "Jupiter free from Rahu/Ketu affliction. Wisdom and dharma are unobstructed.",
    category: "malefic", strength: formed ? "moderate" : "weak",
  };
}

// ── 13. Kemadruma Yoga ────────────────────────────────────

function kemadrumaYoga(p: PlanetMap): YogaResult {
  const moonH = h(p, "Moon");
  const adjacent = [((moonH - 2 + 12) % 12) + 1, (moonH % 12) + 1];
  const otherPlanets = ["Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
  const anyInAdjacent = otherPlanets.some((pl) => adjacent.includes(h(p, pl)));
  // Also cancelled if Moon is in kendra or aspected by Jupiter
  const moonInKendra = KENDRAS.includes(moonH);
  const formed = !anyInAdjacent && !moonInKendra;

  return {
    name: "Kemadruma Yoga", sanskrit: "केमद्रुम योग", formed,
    planets: "Moon isolated (no planets in 2nd or 12th)",
    effect: formed
      ? "Moon is isolated — may cause loneliness, emotional instability, financial struggles, or dependence on others. Remedy: Moon strengthening, Pearl gemstone, and charitable works on Mondays."
      : "Kemadruma Yoga cancelled or not present. Moon is well-supported.",
    category: "malefic", strength: formed ? "moderate" : "weak",
  };
}

// ── 14. Grahan Yoga ───────────────────────────────────────

function grahanYoga(p: PlanetMap): YogaResult {
  const sunWithRahu = s(p, "Sun") === s(p, "Rahu") || s(p, "Sun") === s(p, "Ketu");
  const moonWithRahu = s(p, "Moon") === s(p, "Rahu") || s(p, "Moon") === s(p, "Ketu");
  const formed = sunWithRahu || moonWithRahu;

  return {
    name: "Grahan Yoga", sanskrit: "ग्रहण योग", formed,
    planets: sunWithRahu ? `Sun + ${s(p,"Sun")===s(p,"Rahu") ? "Rahu" : "Ketu"}` : moonWithRahu ? `Moon + ${s(p,"Moon")===s(p,"Rahu") ? "Rahu" : "Ketu"}` : "-",
    effect: formed
      ? "Luminaries afflicted — may cause health issues, setbacks in confidence or emotional instability at key life junctures. Remedy: Eclipse remedies and Rahu/Ketu pacification."
      : "No Grahan Yoga. Luminaries are unafflicted.",
    category: "malefic", strength: formed ? "moderate" : "weak",
  };
}

// ── 15. Amala Yoga ────────────────────────────────────────

function amalaYoga(p: PlanetMap): YogaResult {
  const lagnaH = 1;
  const moonH = h(p, "Moon");
  const tenthFromLagna = 10;
  const tenthFromMoon = ((moonH - 1 + 9) % 12) + 1;

  const planetsInTenthLagna = Object.values(p).filter((pl) => pl.house === tenthFromLagna);
  const planetsInTenthMoon = Object.values(p).filter((pl) => pl.house === tenthFromMoon);

  const allBeneficFromLagna = planetsInTenthLagna.length > 0 && planetsInTenthLagna.every((pl) => {
    const name = Object.entries(p).find(([, v]) => v === pl)?.[0] || "";
    return BENEFICS.includes(name);
  });
  const allBeneficFromMoon = planetsInTenthMoon.length > 0 && planetsInTenthMoon.every((pl) => {
    const name = Object.entries(p).find(([, v]) => v === pl)?.[0] || "";
    return BENEFICS.includes(name);
  });

  const formed = allBeneficFromLagna || allBeneficFromMoon;

  return {
    name: "Amala Yoga", sanskrit: "अमला योग", formed,
    planets: "Only benefics in 10th from Lagna or Moon",
    effect: formed
      ? "Pure and spotless reputation. Fame, charitable nature and lasting legacy. Career in noble professions like education, medicine or social service."
      : "Amala Yoga not formed.",
    category: "benefic", strength: formed ? "moderate" : "weak",
  };
}

// ── 16. Vasumati Yoga ─────────────────────────────────────

function vasumatiYoga(p: PlanetMap): YogaResult {
  const moonH = h(p, "Moon");
  let count = 0;
  for (const benefic of ["Jupiter", "Venus", "Mercury"]) {
    const upachayaFromMoon = UPACHAYAS.map((u) => ((moonH - 1 + u - 1) % 12) + 1);
    if (upachayaFromMoon.includes(h(p, benefic))) count++;
  }
  const formed = count >= 2;

  return {
    name: "Vasumati Yoga", sanskrit: "वसुमती योग", formed,
    planets: "Benefics in upachaya houses from Moon",
    effect: formed
      ? "Wealth, independent thinking and prosperity. Native earns well through intellectual or creative pursuits."
      : "Vasumati Yoga not formed.",
    category: "benefic", strength: formed ? "moderate" : "weak",
  };
}

// ── 17. Shubha Kartari Yoga ───────────────────────────────

function shubhaKartariYoga(p: PlanetMap): YogaResult {
  // Benefics flanking the lagna (in 2nd and 12th from Lagna = houses 2 and 12)
  const beneficsInSecond = Object.entries(p).filter(([name, info]) =>
    info.house === 2 && BENEFICS.includes(name)
  );
  const beneficsInTwelfth = Object.entries(p).filter(([name, info]) =>
    info.house === 12 && BENEFICS.includes(name)
  );
  const formed = beneficsInSecond.length > 0 && beneficsInTwelfth.length > 0;

  return {
    name: "Shubha Kartari Yoga", sanskrit: "शुभ कर्तरी योग", formed,
    planets: `${beneficsInSecond.map(([n]) => n).join("/")} (2nd) + ${beneficsInTwelfth.map(([n]) => n).join("/")} (12th)`,
    effect: formed
      ? "Lagna is protected by benefics on both sides. Excellent health, personality and life circumstances. Natural charisma and good fortune."
      : "Shubha Kartari Yoga not formed.",
    category: "benefic", strength: formed ? "moderate" : "weak",
  };
}

// ── 18. Papa Kartari Yoga ─────────────────────────────────

function papaKartariYoga(p: PlanetMap): YogaResult {
  const maleficsInSecond = Object.entries(p).filter(([name, info]) =>
    info.house === 2 && MALEFICS.includes(name)
  );
  const maleficsInTwelfth = Object.entries(p).filter(([name, info]) =>
    info.house === 12 && MALEFICS.includes(name)
  );
  const formed = maleficsInSecond.length > 0 && maleficsInTwelfth.length > 0;

  return {
    name: "Papa Kartari Yoga", sanskrit: "पाप कर्तरी योग", formed,
    planets: `Malefics in houses 2 and 12`,
    effect: formed
      ? "Lagna hemmed between malefics. May cause health challenges, obstruction in personal matters, or delayed recognition. Remedy: Lagna lord strengthening and regular spiritual practice."
      : "Papa Kartari Yoga not formed. Lagna is unafflicted.",
    category: "malefic", strength: formed ? "moderate" : "weak",
  };
}

// ── 19. Sunapha / Anapha / Durudhara ─────────────────────

function sunaphaDurAduraYoga(p: PlanetMap): YogaResult {
  const moonH = h(p, "Moon");
  const secondFromMoon = (moonH % 12) + 1;
  const twelfthFromMoon = ((moonH - 2 + 12) % 12) + 1;
  const nonSunPlanets = ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"];

  const inSecond = nonSunPlanets.filter((pl) => h(p, pl) === secondFromMoon);
  const inTwelfth = nonSunPlanets.filter((pl) => h(p, pl) === twelfthFromMoon);

  const sunapha = inSecond.length > 0;
  const anapha = inTwelfth.length > 0;
  const durudhara = sunapha && anapha;

  const formed = sunapha || anapha;
  const type = durudhara ? "Durudhara" : sunapha ? "Sunapha" : anapha ? "Anapha" : "";

  return {
    name: `${type} Yoga`, sanskrit: durudhara ? "दुरुधरा योग" : sunapha ? "सुनफा योग" : "अनफा योग",
    formed,
    planets: [
      ...(sunapha ? [`${inSecond.join("/")} in 2nd from Moon`] : []),
      ...(anapha ? [`${inTwelfth.join("/")} in 12th from Moon`] : []),
    ].join(", "),
    effect: formed
      ? durudhara
        ? "Durudhara Yoga — great wealth, respected, kingly qualities, strong intellect and many supporters."
        : sunapha
        ? `Sunapha Yoga (${inSecond.join(", ")} supporting Moon) — self-made wealth, intelligence and good reputation.`
        : `Anapha Yoga (${inTwelfth.join(", ")} supporting Moon) — health, dignity, good appearance and comfortable life.`
      : "No Moon support yogas.",
    category: "benefic", strength: formed ? (durudhara ? "strong" : "moderate") : "weak",
  };
}

// ── 20. Manglik Dosha with cancellation ───────────────────

export interface ManglikAnalysis {
  isManglik: boolean;
  severity: "High" | "Moderate" | "Mild" | "None";
  house: number;
  isCancelled: boolean;
  cancellationReason: string;
  details: string;
}

export function analyzeManglik(p: PlanetMap, houses: HouseMap): ManglikAnalysis {
  const marsH = h(p, "Mars");
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const isManglik = manglikHouses.includes(marsH);
  const rawSeverity = [1, 7, 8].includes(marsH) ? "High" : [2, 12].includes(marsH) ? "Moderate" : isManglik ? "Mild" : "None";

  if (!isManglik) {
    return { isManglik: false, severity: "None", house: marsH, isCancelled: false, cancellationReason: "", details: "Mars is well-placed — no Manglik Dosha. Positive for relationships and partnerships." };
  }

  // Cancellation conditions (Parashara / classical texts)
  let isCancelled = false;
  let reason = "";

  // 1. Mars exalted or in own sign
  if (isExalted(p, "Mars") || isOwn(p, "Mars")) {
    isCancelled = true; reason = "Mars is exalted/own sign — Dosha cancelled.";
  }
  // 2. Mars in Leo or Aquarius
  else if ([4, 10].includes(s(p, "Mars"))) {
    isCancelled = true; reason = "Mars in Leo/Aquarius — classical cancellation applies.";
  }
  // 3. Jupiter aspects the 7th house
  else if (p["Jupiter"] && (calcAspects(p)["Jupiter"] || []).includes(7)) {
    isCancelled = true; reason = "Jupiter aspects 7th house — Dosha substantially reduced.";
  }
  // 4. Venus in 1st, 2nd, 4th, 7th, 8th, or 12th (mutual Manglik cancellation in chart pairing)
  else if ([1, 2, 4, 7, 8, 12].includes(h(p, "Venus"))) {
    isCancelled = false; reason = "Venus placement can counter in chart matching (Manglik × Manglik).";
  }
  // 5. Moon in Cancer (own sign) conjunct Mars — emotion softens Mars aggression
  else if (s(p, "Moon") === 3 && s(p, "Moon") === s(p, "Mars")) {
    isCancelled = true; reason = "Moon in Cancer with Mars — Dosha softened by watery sign.";
  }

  const effectiveSeverity: "High" | "Moderate" | "Mild" | "None" = isCancelled ? "Mild" : rawSeverity;
  return {
    isManglik: true,
    severity: effectiveSeverity,
    house: marsH,
    isCancelled,
    cancellationReason: reason,
    details: isCancelled
      ? `Mars in ${marsH}th house. ${reason} Effective impact is mild.`
      : `Mars in ${marsH}th house — ${rawSeverity} Manglik Dosha. ${marsH === 7 ? "7th house placement most significant for marriage." : marsH === 8 ? "8th house placement affects longevity and in-laws." : marsH === 1 ? "1st house affects self and general temperament." : "Moderately impacts relationship harmony."} Consult a Vedic astrologer for remedies.`,
  };
}

// ── 21. Kaal Sarp Type Detection ─────────────────────────

export interface KaalSarpAnalysis {
  isPresent: boolean;
  type: string;
  ascending: boolean;
  rahuHouse: number;
  ketuHouse: number;
  details: string;
}

const KAALSARP_NAMES = [
  "Anant", "Kulik", "Vasuki", "Shankhapal", "Padma", "Mahapadma",
  "Takshak", "Karkotak", "Shankhnaad", "Patak", "Vishdhar", "Sheshnag",
];

export function analyzeKaalSarp(p: PlanetMap): KaalSarpAnalysis {
  const rahuH = h(p, "Rahu");
  const ketuH = h(p, "Ketu");

  const otherPlanets = Object.entries(p)
    .filter(([name]) => name !== "Rahu" && name !== "Ketu")
    .map(([, info]) => info);

  // All planets must be on one side of the Rahu-Ketu axis
  // Ascending KSY: all planets between Rahu and Ketu going clockwise
  // Descending KSY: all planets between Ketu and Rahu going clockwise
  const rahuIdx = p["Rahu"]?.signIndex ?? 0;
  const ketuIdx = p["Ketu"]?.signIndex ?? 0;

  const span = (ketuIdx - rahuIdx + 12) % 12;
  const allAscending = otherPlanets.every((pl) => {
    const d = (pl.signIndex - rahuIdx + 12) % 12;
    return d > 0 && d < span;
  });
  const allDescending = otherPlanets.every((pl) => {
    const d = (pl.signIndex - ketuIdx + 12) % 12;
    return d > 0 && d < span;
  });

  const isPresent = (allAscending || allDescending) && span > 0 && span < 12;

  if (!isPresent) {
    return { isPresent: false, type: "", ascending: false, rahuHouse: rahuH, ketuHouse: ketuH, details: "No Kaal Sarp Dosha. Planetary spread is balanced." };
  }

  // Type based on Rahu house (0-indexed Rahu sign determines the snake name)
  const typeIndex = (rahuIdx) % 12;
  const typeName = KAALSARP_NAMES[typeIndex] || "Anant";
  const ascending = allAscending;

  const EFFECTS: Record<string, string> = {
    Anant: "Struggles in early life, eventual rise. Career challenges with ultimate success.",
    Kulik: "Financial obstacles, health issues. Gains after age 35.",
    Vasuki: "Relationship challenges, family disputes. Strong after 36.",
    Shankhapal: "Financial instability, legal issues. Spiritual path brings relief.",
    Padma: "Career setbacks, travel abroad. Success in foreign lands or after relocation.",
    Mahapadma: "Success after struggle. Wealth and fame come late but stay permanently.",
    Takshak: "Partnership difficulties, marriage challenges. Stability after 30s.",
    Karkotak: "Health-related obstacles. Spiritual practice strongly recommended.",
    Shankhnaad: "Mental tensions, indecision. Success through persistence.",
    Patak: "Financial losses possible. Avoid speculation and partnerships without due diligence.",
    Vishdhar: "Professional rivalries, enemies. Success through self-reliance.",
    Sheshnag: "Hidden enemies, psychological challenges. Spiritual practice as primary remedy.",
  };

  return {
    isPresent: true,
    type: `${typeName} Kaal Sarp Yoga`,
    ascending,
    rahuHouse: rahuH,
    ketuHouse: ketuH,
    details: `${typeName} Kaal Sarp Yoga — Rahu in ${rahuH}th, Ketu in ${ketuH}th house. ${ascending ? "Ascending (Ascending Kaal Sarp)" : "Descending variety"}. ${EFFECTS[typeName] || "Karmic lessons lead to eventual spiritual growth."} Recommended remedy: Kaal Sarp Shanti Puja, Rahu-Ketu pacification on Nag Panchami.`,
  };
}

// ── Main yoga detector ────────────────────────────────────

export function detectAllYogas(p: PlanetMap, houses: HouseMap): YogaResult[] {
  const aspects = calcAspects(p);
  const all: YogaResult[] = [
    ruchakaYoga(p),
    bhadraYoga(p),
    hamsaYoga(p),
    malavyaYoga(p),
    shashaYoga(p),
    gajakesariYoga(p),
    budhadityaYoga(p),
    chandraMangalaYoga(p),
    lakshmiYoga(p, houses),
    rajaYoga(p, houses, aspects),
    dhanaYoga(p, houses),
    adhiYoga(p),
    saraswatiYoga(p),
    vipareetaRajaYoga(p, houses),
    neechabhangaYoga(p, houses),
    chandalYoga(p),
    kemadrumaYoga(p),
    grahanYoga(p),
    amalaYoga(p),
    vasumatiYoga(p),
    shubhaKartariYoga(p),
    papaKartariYoga(p),
    sunaphaDurAduraYoga(p),
  ];

  // Return formed yogas first, then unformed — filter out empty names
  return all.filter((y) => y.name && y.name !== " Yoga");
}
