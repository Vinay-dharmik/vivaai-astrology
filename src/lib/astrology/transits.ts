/**
 * Real planetary transits (Gochara) for a given date.
 *
 * This replaces the previous approach of hashing the sign name and date to
 * pick from a fixed pool of sentences. Everything below is derived from the
 * actual sidereal position of the nine grahas on the day in question, so a
 * "daily horoscope" changes because the sky changed, not because the date
 * string changed.
 */

import * as Astronomy from "astronomy-engine";
import { RASHI, BODY_ORDER, NAKSHATRAS } from "./constants";
import {
  lahiriAyanamsa,
  planetarySiderealLongitudes,
  detectRetrogrades,
  getRashiInfo,
  getNakshatraInfo,
} from "./calculations";

export interface TransitPosition {
  body: string;
  lon: number;
  signIndex: number;
  sign: string;
  signEnglish: string;
  signDegree: number;
  nakshatra: string;
  retrograde: boolean;
}

/**
 * Classical Gochara Phala — the houses (counted from the natal Moon sign)
 * in which each graha gives favourable results while transiting.
 * Source: Brihat Parashara Hora Shastra, Gochara Adhyaya.
 */
const FAVOURABLE_HOUSES: Record<string, number[]> = {
  Sun: [3, 6, 10, 11],
  Moon: [1, 3, 6, 7, 10, 11],
  Mars: [3, 6, 11],
  Mercury: [2, 4, 6, 8, 10, 11],
  Jupiter: [2, 5, 7, 9, 11],
  Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  Saturn: [3, 6, 11],
  Rahu: [3, 6, 10, 11],
  Ketu: [3, 6, 11],
};

/** What each bhava governs — used to phrase a transit's effect. */
export const HOUSE_AREAS: Record<number, string> = {
  1: "your body, temperament and how you come across",
  2: "savings, family matters and speech",
  3: "initiative, siblings, short travel and communication",
  4: "home, mother, property and peace of mind",
  5: "children, learning, creativity and romance",
  6: "work routine, competition, debts and health",
  7: "marriage, partnerships and dealings with others",
  8: "sudden change, shared finances and research",
  9: "fortune, father, travel and higher learning",
  10: "career, reputation and public standing",
  11: "income, gains, networks and elder siblings",
  12: "expenses, foreign matters, rest and spiritual practice",
};

/** Compute the sidereal position of all nine grahas for a moment in time. */
export function getTransits(dateUtc: Date = new Date()): TransitPosition[] {
  const ayanamsa = lahiriAyanamsa(dateUtc);
  const lons = planetarySiderealLongitudes(dateUtc, ayanamsa, Astronomy);
  const retro = detectRetrogrades(dateUtc, Astronomy);

  return BODY_ORDER.map((body) => {
    const lon = lons[body];
    const r = getRashiInfo(lon);
    const nak = getNakshatraInfo(lon);
    return {
      body,
      lon,
      signIndex: r.signIndex,
      sign: r.name,
      signEnglish: r.english,
      signDegree: r.signDegree,
      nakshatra: nak.name,
      retrograde: retro[body] ?? false,
    };
  });
}

export interface TransitEffect {
  body: string;
  house: number;
  sign: string;
  signEnglish: string;
  retrograde: boolean;
  favourable: boolean;
  area: string;
}

/** Which bhava a transiting planet occupies, counted from a given rashi. */
export function houseFromSign(planetSignIdx: number, fromSignIdx: number): number {
  return ((planetSignIdx - fromSignIdx + 12) % 12) + 1;
}

export interface SignTransitReading {
  signIndex: number;
  signEnglish: string;
  rashi: string;
  lord: string;
  effects: TransitEffect[];
  moon: TransitEffect;
  sadeSati: null | { phase: string; note: string };
  shani: null | { label: string; note: string };
  retrogrades: string[];
  favourableCount: number;
  challengingCount: number;
}

/**
 * Build the full Gochara picture for one rashi on a given date.
 * Everything downstream (predictions, scores) reads from this — no random
 * selection anywhere.
 */
export function getSignTransitReading(
  signIndex: number,
  dateUtc: Date = new Date()
): SignTransitReading {
  const transits = getTransits(dateUtc);
  const rashi = RASHI[signIndex];

  const effects: TransitEffect[] = transits.map((t) => {
    const house = houseFromSign(t.signIndex, signIndex);
    return {
      body: t.body,
      house,
      sign: t.sign,
      signEnglish: t.signEnglish,
      retrograde: t.retrograde,
      favourable: FAVOURABLE_HOUSES[t.body]?.includes(house) ?? false,
      area: HOUSE_AREAS[house],
    };
  });

  const moon = effects.find((e) => e.body === "Moon")!;
  const saturn = effects.find((e) => e.body === "Saturn")!;

  // Sade Sati — Saturn transiting the 12th, 1st or 2nd from the Moon sign.
  let sadeSati: SignTransitReading["sadeSati"] = null;
  if (saturn.house === 12) {
    sadeSati = {
      phase: "Rising phase (first dhaiya)",
      note: "Saturn is in the 12th from your sign, which opens Sade Sati. Expenses and disturbed sleep are common now; it is a period for settling obligations rather than expanding.",
    };
  } else if (saturn.house === 1) {
    sadeSati = {
      phase: "Peak phase (second dhaiya)",
      note: "Saturn transits your own sign — the middle and most demanding stretch of Sade Sati. Health and energy need care, and results come slowly but do come with sustained effort.",
    };
  } else if (saturn.house === 2) {
    sadeSati = {
      phase: "Setting phase (third dhaiya)",
      note: "Saturn is in the 2nd from your sign, the closing stretch of Sade Sati. Attention turns to finances and family; the pressure eases as this phase completes.",
    };
  }

  // Other classical Saturn afflictions counted from the Moon sign.
  let shani: SignTransitReading["shani"] = null;
  if (saturn.house === 4) {
    shani = {
      label: "Kantaka Shani",
      note: "Saturn in the 4th from your sign strains domestic matters and peace of mind. Property decisions benefit from patience.",
    };
  } else if (saturn.house === 8) {
    shani = {
      label: "Ashtama Shani",
      note: "Saturn in the 8th from your sign is a period for caution — avoid unnecessary risk, and give health and paperwork proper attention.",
    };
  }

  const retrogrades = transits.filter((t) => t.retrograde && t.body !== "Rahu" && t.body !== "Ketu").map((t) => t.body);

  return {
    signIndex,
    signEnglish: rashi.english,
    rashi: rashi.name,
    lord: rashi.lord,
    effects,
    moon,
    sadeSati,
    shani,
    retrogrades,
    favourableCount: effects.filter((e) => e.favourable).length,
    challengingCount: effects.filter((e) => !e.favourable).length,
  };
}

/** Nakshatra the Moon occupies right now — the fastest-moving daily marker. */
export function getMoonNakshatra(dateUtc: Date = new Date()): string {
  const t = getTransits(dateUtc).find((x) => x.body === "Moon")!;
  return t.nakshatra;
}

export { NAKSHATRAS };
