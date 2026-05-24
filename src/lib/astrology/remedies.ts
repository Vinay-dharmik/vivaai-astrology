import type { RashiResult } from "./calculations";

export interface RemedySet {
  gemstones: { name: string; planet: string; finger: string; metal: string; day: string }[];
  mantras: { mantra: string; planet: string; count: string }[];
  fasting: { day: string; planet: string; benefit: string }[];
  colors: { color: string; effect: string }[];
  donations: { item: string; day: string; benefit: string }[];
  luckyNumbers: number[];
  luckyDay: string;
}

const PLANET_GEMS: Record<string, { name: string; finger: string; metal: string; day: string }> = {
  Sun: { name: "Ruby (Manik)", finger: "Ring finger", metal: "Gold", day: "Sunday" },
  Moon: { name: "Pearl (Moti)", finger: "Little finger", metal: "Silver", day: "Monday" },
  Mars: { name: "Red Coral (Moonga)", finger: "Ring finger", metal: "Gold/Copper", day: "Tuesday" },
  Mercury: { name: "Emerald (Panna)", finger: "Little finger", metal: "Gold", day: "Wednesday" },
  Jupiter: { name: "Yellow Sapphire (Pukhraj)", finger: "Index finger", metal: "Gold", day: "Thursday" },
  Venus: { name: "Diamond (Heera)", finger: "Middle finger", metal: "Platinum/Silver", day: "Friday" },
  Saturn: { name: "Blue Sapphire (Neelam)", finger: "Middle finger", metal: "Silver/Iron", day: "Saturday" },
  Rahu: { name: "Hessonite (Gomed)", finger: "Middle finger", metal: "Silver", day: "Saturday" },
  Ketu: { name: "Cat's Eye (Lehsunia)", finger: "Little finger", metal: "Silver", day: "Tuesday" },
};

const PLANET_MANTRAS: Record<string, string> = {
  Sun: "Om Suryaya Namah",
  Moon: "Om Chandraya Namah",
  Mars: "Om Mangalaya Namah",
  Mercury: "Om Budhaya Namah",
  Jupiter: "Om Gurave Namah",
  Venus: "Om Shukraya Namah",
  Saturn: "Om Shanaishcharaya Namah",
  Rahu: "Om Rahuve Namah",
  Ketu: "Om Ketave Namah",
};

const FASTING_DAYS: Record<string, { day: string; benefit: string }> = {
  Sun: { day: "Sunday", benefit: "Strengthens confidence, health & authority" },
  Moon: { day: "Monday", benefit: "Emotional balance & mental peace" },
  Mars: { day: "Tuesday", benefit: "Courage, energy & Manglik dosha remedy" },
  Mercury: { day: "Wednesday", benefit: "Intelligence, communication & business" },
  Jupiter: { day: "Thursday", benefit: "Wisdom, education & prosperity" },
  Venus: { day: "Friday", benefit: "Relationships, beauty & luxury" },
  Saturn: { day: "Saturday", benefit: "Discipline, longevity & karmic relief" },
};

const LAGNA_COLORS: Record<string, { color: string; effect: string }[]> = {
  Fire: [{ color: "Red / Orange", effect: "Boosts energy & confidence" }, { color: "Gold / Yellow", effect: "Attracts prosperity" }],
  Earth: [{ color: "Green / Brown", effect: "Grounding & stability" }, { color: "White / Cream", effect: "Peace & clarity" }],
  Air: [{ color: "Blue / Light Green", effect: "Mental clarity & communication" }, { color: "Purple", effect: "Spiritual growth" }],
  Water: [{ color: "Silver / White", effect: "Emotional balance" }, { color: "Sea Green", effect: "Healing & intuition" }],
};

export function generateRemedies(
  lagna: RashiResult,
  moonSign: RashiResult,
  dashaCurrent: string,
  weakPlanets: string[]
): RemedySet {
  // Primary gemstone = Lagna lord, secondary = Moon lord, support = current dasha lord
  const primaryPlanets = [lagna.lord, moonSign.lord, dashaCurrent].filter((v, i, a) => a.indexOf(v) === i);

  const gemstones = primaryPlanets.map((p) => ({
    ...PLANET_GEMS[p],
    planet: p,
  })).filter((g) => g.name);

  const mantras = primaryPlanets.map((p) => ({
    mantra: PLANET_MANTRAS[p] || `Om ${p}aya Namah`,
    planet: p,
    count: "108 times daily",
  }));

  // Add weak planet mantras
  for (const wp of weakPlanets.slice(0, 2)) {
    if (!primaryPlanets.includes(wp) && PLANET_MANTRAS[wp]) {
      mantras.push({ mantra: PLANET_MANTRAS[wp], planet: wp, count: "21 times daily" });
    }
  }

  const fasting = primaryPlanets
    .map((p) => FASTING_DAYS[p] ? { ...FASTING_DAYS[p], planet: p } : null)
    .filter((f): f is NonNullable<typeof f> => f !== null);

  const colors = LAGNA_COLORS[lagna.element] || LAGNA_COLORS["Fire"];

  const donations = [
    { item: "Food / grains", day: "Thursday", benefit: "Jupiter blessings & wisdom" },
    { item: "Black sesame / mustard oil", day: "Saturday", benefit: "Saturn relief & karmic balance" },
    { item: "Jaggery / wheat", day: "Sunday", benefit: "Sun strength & vitality" },
  ];

  const luckyNumbers = [
    (lagna.signIndex + 1),
    ((moonSign.signIndex + 1) * 3) % 9 + 1,
    (lagna.signIndex + moonSign.signIndex) % 9 + 1,
  ];

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const luckyDay = FASTING_DAYS[lagna.lord]?.day || days[lagna.signIndex % 7];

  return { gemstones, mantras, fasting, colors, donations, luckyNumbers, luckyDay };
}
