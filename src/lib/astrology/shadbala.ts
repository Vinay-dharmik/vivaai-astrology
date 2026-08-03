/**
 * Shadbala — the six-fold strength of a planet, from Brihat Parashara Hora
 * Shastra ch. 27 and Phaladeepika ch. 2.
 *
 * Everything is computed in Virupas; 60 Virupas make one Rupa. Parashara gives
 * a required minimum for each planet, and the ratio of what a planet scores to
 * what it needs is the single most useful number in the whole scheme: a planet
 * below its minimum promises results it cannot deliver on time.
 *
 * Not every classical sub-component is implemented. Abda, Masa and Tribhaga
 * Bala depend on calendar conventions that vary by region, and inventing a
 * convention to fill the number in would make the total look more authoritative
 * than it is. `KALA_COMPONENTS_INCLUDED` records exactly what went in.
 */

import { normalizeDegree, MEAN_DAILY_MOTION, angularSeparation } from "./calculations";

export const SHADBALA_PLANETS = [
  "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn",
] as const;

export type ShadbalaPlanet = (typeof SHADBALA_PLANETS)[number];

/** Parashara's required minimum total, in Rupas. */
export const REQUIRED_RUPAS: Record<ShadbalaPlanet, number> = {
  Sun: 5, Moon: 6, Mars: 5, Mercury: 7, Jupiter: 6.5, Venus: 5.5, Saturn: 5,
};

export const KALA_COMPONENTS_INCLUDED = [
  "Nathonnatha", "Paksha", "Ayana", "Vara", "Hora",
] as const;

// ── Reference points ──────────────────────────────────────

/** Exact exaltation longitude of each planet, in the sidereal zodiac. */
const EXALTATION_LON: Record<ShadbalaPlanet, number> = {
  Sun: 10,        // Aries 10°
  Moon: 33,       // Taurus 3°
  Mars: 298,      // Capricorn 28°
  Mercury: 165,   // Virgo 15°
  Jupiter: 95,    // Cancer 5°
  Venus: 357,     // Pisces 27°
  Saturn: 200,    // Libra 20°
};

/** House in which each planet gains full Dig Bala. */
const DIG_BALA_HOUSE: Record<ShadbalaPlanet, number> = {
  Jupiter: 1, Mercury: 1,   // East / Ascendant
  Sun: 10, Mars: 10,        // South / Midheaven
  Saturn: 7,                // West / Descendant
  Moon: 4, Venus: 4,        // North / Nadir
};

/** Fixed natural strength, Parashara's ordering by apparent brightness. */
const NAISARGIKA: Record<ShadbalaPlanet, number> = {
  Sun: 60, Moon: 51.43, Venus: 42.85, Jupiter: 34.28,
  Mercury: 25.70, Mars: 17.14, Saturn: 8.57,
};

const NATURAL_BENEFIC: Record<string, boolean> = {
  Jupiter: true, Venus: true, Mercury: true, Moon: true,
  Sun: false, Mars: false, Saturn: false, Rahu: false, Ketu: false,
};

/** Planets that are strong at night, by day, and the one that never cares. */
const NIGHT_STRONG: ShadbalaPlanet[] = ["Moon", "Mars", "Saturn"];
const DAY_STRONG: ShadbalaPlanet[] = ["Sun", "Jupiter", "Venus"];

/** Weekday lords, index 0 = Sunday. */
const VARA_LORD = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
/** Chaldean order, used for the hora (planetary hour) sequence. */
const HORA_ORDER = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];

// ── Friendship ────────────────────────────────────────────

const OWN_SIGNS: Record<ShadbalaPlanet, number[]> = {
  Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5],
  Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
};

const MOOLATRIKONA: Record<ShadbalaPlanet, number> = {
  Sun: 4, Moon: 1, Mars: 0, Mercury: 5, Jupiter: 8, Venus: 6, Saturn: 10,
};

const NATURAL_FRIENDS: Record<ShadbalaPlanet, ShadbalaPlanet[]> = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mercury"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"],
};

const NATURAL_ENEMIES: Record<ShadbalaPlanet, ShadbalaPlanet[]> = {
  Sun: ["Venus", "Saturn"],
  Moon: [],
  Mars: ["Mercury"],
  Mercury: ["Moon"],
  Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"],
  Saturn: ["Sun", "Moon", "Mars"],
};

const SIGN_LORD_INDEX: ShadbalaPlanet[] = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

/**
 * Strength a planet draws from the sign it sits in, on Parashara's scale:
 * Moolatrikona 45, own 30, great friend 22.5, friend 15, neutral 7.5,
 * enemy 3.75, great enemy 1.875 Virupas.
 */
function dignityScore(planet: ShadbalaPlanet, signIndex: number): number {
  if (MOOLATRIKONA[planet] === signIndex) return 45;
  if (OWN_SIGNS[planet].includes(signIndex)) return 30;

  const lord = SIGN_LORD_INDEX[signIndex];
  if (lord === planet) return 30;
  if (NATURAL_FRIENDS[planet].includes(lord)) return 22.5;
  if (NATURAL_ENEMIES[planet].includes(lord)) return 3.75;
  return 7.5;
}

// ── Inputs ────────────────────────────────────────────────

export interface ShadbalaInput {
  /** Sidereal longitude of each of the seven planets, 0–360. */
  longitudes: Record<string, number>;
  /** Signed daily motion; negative means retrograde. */
  speeds: Record<string, number>;
  /** House 1–12 occupied by each planet. */
  houses: Record<string, number>;
  /** Sidereal longitude of the Ascendant. */
  ascendantLon: number;
  /** Birth moment in UTC — used for the weekday and hora lords. */
  birthUtc: Date;
  /** Local clock hour at birth, 0–24 including the fraction. */
  localHour: number;
  /** Whether the Sun was above the horizon. */
  isDayBirth: boolean;
  /** Sun's declination at birth, for Ayana Bala. */
  sunDeclination: number;
  /** Declination of each planet, for Ayana Bala. */
  declinations: Record<string, number>;
}

export interface BalaBreakdown {
  uchcha: number;
  saptavargaja: number;
  ojhayugma: number;
  kendradi: number;
  drekkana: number;
  sthanaTotal: number;
  dig: number;
  nathonnatha: number;
  paksha: number;
  ayana: number;
  vara: number;
  hora: number;
  kalaTotal: number;
  cheshta: number;
  naisargika: number;
  drik: number;
}

export interface PlanetStrength {
  planet: ShadbalaPlanet;
  breakdown: BalaBreakdown;
  /** Grand total in Virupas. */
  totalVirupas: number;
  /** Grand total in Rupas (Virupas / 60). */
  totalRupas: number;
  requiredRupas: number;
  /** totalRupas / requiredRupas. Above 1.0 is a planet that can deliver. */
  ratio: number;
  /** Rank 1–7, strongest first. */
  rank: number;
  verdict: "Very Strong" | "Strong" | "Adequate" | "Weak" | "Very Weak";
}

// ── The six strengths ─────────────────────────────────────

/** Uchcha Bala — proximity to the exaltation degree. */
function uchchaBala(planet: ShadbalaPlanet, lon: number): number {
  const debilitation = normalizeDegree(EXALTATION_LON[planet] + 180);
  return (angularSeparation(lon, debilitation) / 180) * 60;
}

/**
 * Saptavargaja Bala, reduced to the divisions this engine computes exactly.
 *
 * The classical figure sums dignity across seven vargas. We hold D1, D2, D3,
 * D9 and D12, and scale the result so the maximum stays on Parashara's scale
 * rather than silently reporting a smaller number as if it were the full one.
 */
function saptavargajaBala(planet: ShadbalaPlanet, lon: number): number {
  const sign = Math.floor(normalizeDegree(lon) / 30);
  const degInSign = normalizeDegree(lon) % 30;

  // D2 Hora: first half of an odd sign is the Sun's (Leo), second half the
  // Moon's (Cancer); reversed for even signs.
  const isOdd = sign % 2 === 0;
  const firstHalf = degInSign < 15;
  const horaSign = isOdd === firstHalf ? 4 : 3;

  // D3 Drekkana: thirds map to the sign itself, the 5th from it, the 9th.
  const drekkanaSign = (sign + Math.floor(degInSign / 10) * 4) % 12;

  // D9 Navamsa.
  const navamsaStart = [0, 9, 6, 3][sign % 4];
  const navamsaSign = (navamsaStart + Math.floor(degInSign / (30 / 9))) % 12;

  // D12 Dwadashamsa.
  const dwadashSign = (sign + Math.floor(degInSign / 2.5)) % 12;

  const parts = [sign, horaSign, drekkanaSign, navamsaSign, dwadashSign];
  const raw = parts.reduce((s, v) => s + dignityScore(planet, v), 0);
  // Five divisions scored against a seven-division maximum.
  return raw * (7 / 5);
}

/** Ojhayugmarasyamsa Bala — odd/even preference in sign and Navamsa. */
function ojhayugmaBala(planet: ShadbalaPlanet, lon: number): number {
  const sign = Math.floor(normalizeDegree(lon) / 30);
  const degInSign = normalizeDegree(lon) % 30;
  const navamsaStart = [0, 9, 6, 3][sign % 4];
  const navamsaSign = (navamsaStart + Math.floor(degInSign / (30 / 9))) % 12;

  // Moon and Venus want even signs; everyone else wants odd.
  const wantsEven = planet === "Moon" || planet === "Venus";
  const signIsEven = sign % 2 === 1;
  const navamsaIsEven = navamsaSign % 2 === 1;

  return (signIsEven === wantsEven ? 15 : 0) + (navamsaIsEven === wantsEven ? 15 : 0);
}

/** Kendradi Bala — angular houses are strongest, cadent weakest. */
function kendradiBala(house: number): number {
  if ([1, 4, 7, 10].includes(house)) return 60;
  if ([2, 5, 8, 11].includes(house)) return 30;
  return 15;
}

/** Drekkana Bala — male, neuter and female planets each own one third. */
function drekkanaBala(planet: ShadbalaPlanet, lon: number): number {
  const third = Math.floor((normalizeDegree(lon) % 30) / 10); // 0,1,2
  const male: ShadbalaPlanet[] = ["Sun", "Mars", "Jupiter"];
  const neuter: ShadbalaPlanet[] = ["Mercury", "Saturn"];
  if (male.includes(planet)) return third === 0 ? 15 : 0;
  if (neuter.includes(planet)) return third === 1 ? 15 : 0;
  return third === 2 ? 15 : 0; // Moon, Venus
}

/** Dig Bala — strength from the direction a planet occupies. */
function digBala(planet: ShadbalaPlanet, lon: number, ascendantLon: number): number {
  const strongHouse = DIG_BALA_HOUSE[planet];
  // Longitude of the cusp where this planet is strongest, whole-sign based.
  const strongPoint = normalizeDegree(ascendantLon + (strongHouse - 1) * 30);
  const weakPoint = normalizeDegree(strongPoint + 180);
  return (angularSeparation(lon, weakPoint) / 180) * 60;
}

/**
 * Nathonnatha Bala — diurnal planets peak at local noon, nocturnal ones at
 * local midnight, and Mercury is at full strength always.
 */
function nathonnathaBala(planet: ShadbalaPlanet, localHour: number): number {
  if (planet === "Mercury") return 60;
  // Hours from midnight, folded to 0–12.
  const fromMidnight = Math.min(localHour, 24 - localHour);
  const nightShare = (fromMidnight / 12) * 60; // 60 at midnight, 0 at noon
  if (NIGHT_STRONG.includes(planet)) return 60 - nightShare;
  if (DAY_STRONG.includes(planet)) return nightShare;
  return 30;
}

/**
 * Paksha Bala — benefics gain as the Moon waxes, malefics as it wanes.
 * The Moon's own Paksha Bala is doubled, per Parashara.
 */
function pakshaBala(planet: ShadbalaPlanet, sunLon: number, moonLon: number): number {
  let elongation = normalizeDegree(moonLon - sunLon);
  // Distance into the bright half, 0 at new moon, 1 at full.
  const brightness = elongation <= 180 ? elongation / 180 : (360 - elongation) / 180;
  const benefic = NATURAL_BENEFIC[planet];
  const value = benefic ? brightness * 60 : (1 - brightness) * 60;
  return planet === "Moon" ? Math.min(60, value * 2) : value;
}

/**
 * Ayana Bala — strength from declination. Planets that favour northern
 * declination gain as they move north; Saturn and Mars prefer the south.
 */
function ayanaBala(planet: ShadbalaPlanet, declination: number): number {
  const southPreferring: ShadbalaPlanet[] = ["Saturn", "Mars"];
  const effective = southPreferring.includes(planet) ? -declination : declination;
  // Mercury benefits from any declination away from zero.
  const d = planet === "Mercury" ? Math.abs(declination) : effective;
  const value = 30 + (d / 24) * 30;
  return Math.max(0, Math.min(60, value));
}

/** Vara Bala — the lord of the weekday gets 45 Virupas. */
function varaBala(planet: ShadbalaPlanet, weekday: number): number {
  return VARA_LORD[weekday] === planet ? 45 : 0;
}

/** Hora Bala — the lord of the planetary hour gets 60 Virupas. */
function horaBala(planet: ShadbalaPlanet, weekday: number, localHour: number): number {
  // The day's first hora belongs to the weekday lord; the rest follow the
  // Chaldean order.
  const dayLord = VARA_LORD[weekday];
  const startIdx = HORA_ORDER.indexOf(dayLord);
  const hourIdx = Math.floor(localHour);
  const lord = HORA_ORDER[(startIdx + hourIdx) % 7];
  return lord === planet ? 60 : 0;
}

/**
 * Cheshta Bala — strength from apparent motion. A retrograde planet is at its
 * most insistent, a stationary one at its least effective.
 *
 * The Sun and Moon never retrograde, so Parashara substitutes their Ayana and
 * Paksha Bala respectively.
 */
function cheshtaBala(
  planet: ShadbalaPlanet,
  speed: number,
  substitute: number
): number {
  if (planet === "Sun" || planet === "Moon") return substitute;
  if (speed < 0) return 60; // Vakra — retrograde
  const mean = MEAN_DAILY_MOTION[planet] ?? 1;
  const ratio = Math.abs(speed) / mean;
  if (ratio < 0.15) return 15;  // Vikala — stationary
  if (ratio < 0.6) return 30;   // Manda — slow
  if (ratio < 1.4) return 30;   // Sama — mean
  return 45;                    // Chara / Atichara — swift
}

/**
 * Drik Bala — the net of aspects received. Benefic sight adds, malefic sight
 * subtracts, and both are weighted by how exact the aspect is.
 */
function drikBala(
  planet: ShadbalaPlanet,
  longitudes: Record<string, number>
): number {
  let total = 0;
  for (const other of SHADBALA_PLANETS) {
    if (other === planet) continue;
    const strength = aspectStrength(other, longitudes[other], longitudes[planet]);
    if (strength === 0) continue;
    total += NATURAL_BENEFIC[other] ? strength : -strength;
  }
  // Parashara divides the net virupas by four.
  return total / 4;
}

/**
 * How strongly `from` aspects `to`, 0–60 Virupas.
 *
 * Every planet casts a full 7th-house aspect. Mars adds the 4th and 8th,
 * Jupiter the 5th and 9th, Saturn the 3rd and 10th. Strength tapers over a
 * 15° orb either side of exactness.
 */
export function aspectStrength(from: string, fromLon: number, toLon: number): number {
  const diff = normalizeDegree(toLon - fromLon);

  const special: Record<string, number[]> = {
    Mars: [90, 180, 210],
    Jupiter: [120, 180, 240],
    Saturn: [60, 180, 270],
  };
  const angles = special[from] ?? [180];

  let best = 0;
  for (const angle of angles) {
    const off = Math.abs(((diff - angle + 540) % 360) - 180);
    const orb = Math.abs(180 - off); // 0 at exact
    if (orb <= 15) best = Math.max(best, 60 * (1 - orb / 15));
  }
  return best;
}

// ── Assembly ──────────────────────────────────────────────

export function computeShadbala(input: ShadbalaInput): PlanetStrength[] {
  const { longitudes, speeds, houses, ascendantLon, birthUtc, localHour, declinations } = input;
  const weekday = weekdayForBirth(birthUtc, localHour);

  const rows = SHADBALA_PLANETS.map((planet) => {
    const lon = normalizeDegree(longitudes[planet] ?? 0);
    const house = houses[planet] ?? 1;

    const uchcha = uchchaBala(planet, lon);
    const saptavargaja = saptavargajaBala(planet, lon);
    const ojhayugma = ojhayugmaBala(planet, lon);
    const kendradi = kendradiBala(house);
    const drekkana = drekkanaBala(planet, lon);
    const sthanaTotal = uchcha + saptavargaja + ojhayugma + kendradi + drekkana;

    const dig = digBala(planet, lon, ascendantLon);

    const nathonnatha = nathonnathaBala(planet, localHour);
    const paksha = pakshaBala(planet, longitudes.Sun, longitudes.Moon);
    const ayana = ayanaBala(planet, declinations[planet] ?? 0);
    const vara = varaBala(planet, weekday);
    const hora = horaBala(planet, weekday, localHour);
    const kalaTotal = nathonnatha + paksha + ayana + vara + hora;

    const substitute = planet === "Sun" ? ayana : paksha;
    const cheshta = cheshtaBala(planet, speeds[planet] ?? 0, substitute);
    const naisargika = NAISARGIKA[planet];
    const drik = drikBala(planet, longitudes);

    const totalVirupas = sthanaTotal + dig + kalaTotal + cheshta + naisargika + drik;
    const totalRupas = totalVirupas / 60;
    const requiredRupas = REQUIRED_RUPAS[planet];
    const ratio = totalRupas / requiredRupas;

    return {
      planet,
      breakdown: {
        uchcha, saptavargaja, ojhayugma, kendradi, drekkana, sthanaTotal,
        dig, nathonnatha, paksha, ayana, vara, hora, kalaTotal,
        cheshta, naisargika, drik,
      },
      totalVirupas,
      totalRupas,
      requiredRupas,
      ratio,
      rank: 0,
      verdict: verdictFor(ratio),
    } as PlanetStrength;
  });

  rows
    .slice()
    .sort((a, b) => b.totalVirupas - a.totalVirupas)
    .forEach((r, i) => { r.rank = i + 1; });

  return rows;
}

function verdictFor(ratio: number): PlanetStrength["verdict"] {
  if (ratio >= 1.4) return "Very Strong";
  if (ratio >= 1.1) return "Strong";
  if (ratio >= 0.9) return "Adequate";
  if (ratio >= 0.7) return "Weak";
  return "Very Weak";
}

/**
 * The Vedic day runs sunrise to sunrise, so a birth between midnight and dawn
 * still belongs to the previous weekday.
 */
function weekdayForBirth(birthUtc: Date, localHour: number): number {
  const d = birthUtc.getUTCDay();
  return localHour < 6 ? (d + 6) % 7 : d;
}

/** Declination of an ecliptic longitude, assuming zero ecliptic latitude. */
export function declinationOf(tropicalLon: number, obliquityDeg = 23.4393): number {
  const l = (tropicalLon * Math.PI) / 180;
  const e = (obliquityDeg * Math.PI) / 180;
  return (Math.asin(Math.sin(e) * Math.sin(l)) * 180) / Math.PI;
}
