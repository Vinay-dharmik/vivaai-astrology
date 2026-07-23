/**
 * Daily horoscope built from the actual sky.
 *
 * Every sentence below is assembled from where the nine grahas genuinely are
 * on the requested date, which bhava each one occupies counted from the
 * reader's rashi, and whether that placement is favourable under classical
 * Gochara rules. The Moon changes sign roughly every 2¼ days and the faster
 * grahas move daily, so the reading changes for real reasons.
 */

import { RASHI } from "./constants";
import {
  getSignTransitReading,
  getTransits,
  HOUSE_AREAS,
  type SignTransitReading,
  type TransitEffect,
} from "./transits";

const SIGN_SLUGS = RASHI.map((r) => r.english.toLowerCase());

/** How each graha behaves when its transit is going well / badly. */
const TONE: Record<string, { good: string; hard: string }> = {
  Sun: {
    good: "brings recognition and the confidence to be visible",
    hard: "can bruise the ego and put you at odds with people in authority",
  },
  Moon: {
    good: "steadies the mind and makes people receptive to you",
    hard: "unsettles the mood and makes small things feel larger than they are",
  },
  Mars: {
    good: "supplies drive, stamina and the nerve to push a matter through",
    hard: "shortens the temper and tempts you into avoidable conflict",
  },
  Mercury: {
    good: "sharpens thinking, negotiation and anything involving paperwork",
    hard: "muddles communication and makes details easy to miss",
  },
  Jupiter: {
    good: "opens the way through guidance, goodwill and timely help",
    hard: "encourages overreach and promises more than the situation can carry",
  },
  Venus: {
    good: "eases relationships, comfort and matters of taste",
    hard: "invites indulgence and blurs judgement in close relationships",
  },
  Saturn: {
    good: "rewards patience, routine and work others avoid",
    hard: "slows things down and asks for endurance before results",
  },
  Rahu: {
    good: "favours the unconventional route and unfamiliar territory",
    hard: "amplifies restlessness and makes shortcuts look better than they are",
  },
  Ketu: {
    good: "sharpens insight and cuts attachment to what has run its course",
    hard: "brings detachment or doubt where commitment is needed",
  },
};

/** Which houses feed which life area, for scoring. */
const AREA_HOUSES = {
  career: [10, 6, 11, 3],
  love: [7, 5, 2, 4],
  health: [1, 6, 8, 12],
  finance: [2, 11, 9, 5],
};

function ordinal(n: number): string {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

/** Score an area 40–95 from how the grahas in those houses are placed. */
function scoreArea(reading: SignTransitReading, houses: number[]): number {
  let score = 62;
  for (const e of reading.effects) {
    if (!houses.includes(e.house)) continue;
    const weight = houses.indexOf(e.house) === 0 ? 9 : 5;
    score += e.favourable ? weight : -weight;
    if (e.retrograde) score -= 2;
  }
  if (reading.sadeSati) score -= 5;
  return Math.max(40, Math.min(95, Math.round(score)));
}

function areaLine(
  reading: SignTransitReading,
  houses: number[],
  opening: string
): string {
  const relevant = reading.effects.filter((e) => houses.includes(e.house));
  if (relevant.length === 0) {
    return `${opening} No graha is transiting these houses from ${reading.signEnglish} today, so matters here move at their own pace rather than being pushed by a transit.`;
  }
  const parts = relevant.slice(0, 3).map((e) => {
    const tone = TONE[e.body];
    return `${e.body} in your ${ordinal(e.house)} (${HOUSE_AREAS[e.house]}) ${e.favourable ? tone.good : tone.hard}`;
  });
  return `${opening} ${parts.join("; ")}.`;
}

export interface DailyHoroscope {
  date: string;
  sign: string;
  rashi: string;
  lord: string;
  general: string;
  career: string;
  love: string;
  health: string;
  finance: string;
  moonSign: string;
  moonHouse: number;
  moonNakshatra: string;
  retrogrades: string[];
  sadeSati: SignTransitReading["sadeSati"];
  shani: SignTransitReading["shani"];
  /** Every transit, so the page can show its working. */
  transitTable: TransitEffect[];
  luckyNumber: number;
  luckyColor: string;
  mood: string;
  loveScore: number;
  careerScore: number;
  healthScore: number;
  financeScore: number;
}

export function generateDailyHoroscope(
  sign: string,
  date: Date = new Date()
): DailyHoroscope {
  const signIndex = SIGN_SLUGS.indexOf(sign.toLowerCase());
  const idx = signIndex >= 0 ? signIndex : 0;
  const reading = getSignTransitReading(idx, date);
  const rashi = RASHI[idx];

  const moonT = getTransits(date).find((t) => t.body === "Moon")!;
  const moon = reading.moon;

  const strongest = reading.effects
    .filter((e) => e.favourable && e.body !== "Moon")
    .sort((a, b) => a.house - b.house)[0];
  const hardest = reading.effects
    .filter((e) => !e.favourable && e.body !== "Moon")
    .sort((a, b) => a.house - b.house)[0];

  const generalParts: string[] = [
    `The Moon is in ${moon.signEnglish} today, which is the ${ordinal(moon.house)} house from ${rashi.english} — ${moon.area}. That is where your attention naturally goes.`,
  ];
  if (strongest) {
    generalParts.push(
      `${strongest.body} is transiting your ${ordinal(strongest.house)} house and is well placed there: it ${TONE[strongest.body].good}.`
    );
  }
  if (hardest) {
    generalParts.push(
      `${hardest.body} in your ${ordinal(hardest.house)} house is the harder influence — it ${TONE[hardest.body].hard}, so leave margin around ${HOUSE_AREAS[hardest.house]}.`
    );
  }
  if (reading.retrogrades.length) {
    generalParts.push(
      `${reading.retrogrades.join(" and ")} ${reading.retrogrades.length > 1 ? "are" : "is"} retrograde, which favours reviewing and finishing existing work over starting something new.`
    );
  }
  if (reading.sadeSati) generalParts.push(reading.sadeSati.note);
  else if (reading.shani) generalParts.push(reading.shani.note);

  const luckyColors = ["Gold", "Silver", "Deep Red", "Emerald Green", "Saffron", "White", "Sky Blue", "Deep Blue", "Grey"];
  const lordColorIdx = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].indexOf(rashi.lord);

  return {
    date: date.toISOString().split("T")[0],
    sign: rashi.english,
    rashi: rashi.name,
    lord: rashi.lord,
    general: generalParts.join(" "),
    career: areaLine(reading, AREA_HOUSES.career, "Career today is shaped by what sits in your 10th, 6th, 11th and 3rd houses."),
    love: areaLine(reading, AREA_HOUSES.love, "For relationships, look at your 7th, 5th, 2nd and 4th houses."),
    health: areaLine(reading, AREA_HOUSES.health, "Health follows the 1st, 6th, 8th and 12th houses from your sign."),
    finance: areaLine(reading, AREA_HOUSES.finance, "Money matters track your 2nd, 11th, 9th and 5th houses."),
    moonSign: moon.signEnglish,
    moonHouse: moon.house,
    moonNakshatra: moonT.nakshatra,
    retrogrades: reading.retrogrades,
    sadeSati: reading.sadeSati,
    shani: reading.shani,
    transitTable: reading.effects,
    // Derived from the chart, not from a hash: the Moon's house is the day's
    // fastest-changing marker, and the lucky colour follows the rashi lord.
    luckyNumber: ((moon.house + idx) % 9) + 1,
    luckyColor: luckyColors[lordColorIdx >= 0 ? lordColorIdx : 0],
    mood: moon.favourable ? "Settled" : "Restless",
    loveScore: scoreArea(reading, AREA_HOUSES.love),
    careerScore: scoreArea(reading, AREA_HOUSES.career),
    healthScore: scoreArea(reading, AREA_HOUSES.health),
    financeScore: scoreArea(reading, AREA_HOUSES.finance),
  };
}
