import type { RashiResult, NakshatraResult, DashaSummary, PlanetRow } from "./calculations";

function findHouse(rows: PlanetRow[], planet: string): number | undefined {
  return rows.find((r) => r.body === planet)?.house;
}

// ── Temperament ──────────────────────────────────────────

export function describeTemperament(
  lagna: RashiResult,
  moon: RashiResult,
  nak: NakshatraResult,
  rows: PlanetRow[]
): string {
  const tone: Record<string, string> = {
    Fire: "action-driven and direct",
    Earth: "grounded, practical, and stable",
    Air: "intellectual, fast-thinking, and social",
    Water: "intuitive, sensitive, and emotionally deep",
  };
  const mercH = findHouse(rows, "Mercury");
  const behavior = mercH && [3, 5, 10, 11].includes(mercH)
    ? "communicates smartly and learns quickly"
    : "thinks deeply before sharing opinions";

  return `${lagna.name} Lagna with ${moon.name} Moon and ${nak.name} Nakshatra indicates a ${tone[lagna.element]} personality. This native ${behavior} and values dignity in relationships.`;
}

// ── Positives & Challenges ───────────────────────────────

export interface Challenge { issue: string; solution: string; }

export function getPositivesAndChallenges(
  lagna: RashiResult,
  moon: RashiResult,
  rows: PlanetRow[]
): { positives: string[]; challenges: Challenge[] } {
  const jH = findHouse(rows, "Jupiter");
  const vH = findHouse(rows, "Venus");
  const satH = findHouse(rows, "Saturn");
  const raH = findHouse(rows, "Rahu");

  const positives = [
    `Natural strength in ${lagna.element.toLowerCase()}-element qualities.`,
    jH && [1, 5, 9, 10, 11].includes(jH)
      ? "Strong Jupiter supports education, wisdom, and luck."
      : "Spiritual growth improves with mentorship and study.",
    vH && [1, 4, 5, 7, 10, 11].includes(vH)
      ? "Good support for relationships and creativity from Venus."
      : "Relationship potential rises through emotional maturity.",
  ];

  const challenges: Challenge[] = [
    {
      issue: satH && [1, 7, 10].includes(satH)
        ? "Saturn may delay key milestones."
        : "Periods of slow progress despite strong effort.",
      solution: "Maintain patience and avoid comparing timelines.",
    },
    {
      issue: raH && [1, 7, 10].includes(raH)
        ? "Rahu may create confusion in career direction."
        : "Distraction risk through over-ambition.",
      solution: "Focus on one core goal and keep ethical boundaries.",
    },
  ];

  if (moon.element === "Water") {
    challenges.push({
      issue: "Sensitivity to criticism may reduce confidence temporarily.",
      solution: "Build emotional boundaries and maintain a stable routine.",
    });
  }

  return { positives, challenges };
}

// ── Marriage Window ──────────────────────────────────────

export interface MarriageEstimate {
  primary: string;
  secondary: string;
  signals: string[];
}

export function estimateMarriageWindow(
  ageYears: number,
  dasha: DashaSummary,
  rows: PlanetRow[]
): MarriageEstimate {
  let start = 24, end = 29;
  const signals: string[] = [];
  const vH = findHouse(rows, "Venus");
  const jH = findHouse(rows, "Jupiter");
  const satH = findHouse(rows, "Saturn");

  if (vH && [1, 5, 7, 11].includes(vH)) { start -= 1; signals.push("Venus supports relationship formation."); }
  if (jH && [2, 5, 7, 9, 11].includes(jH)) { start -= 1; signals.push("Jupiter gives stability for commitment."); }
  if (satH && [7, 8, 10].includes(satH)) { start += 1; end += 2; signals.push("Saturn indicates delay but seriousness."); }
  if (!signals.length) signals.push("Marriage timing depends on career stability and family alignment.");

  return {
    primary: `${start} – ${end} years`,
    secondary: `${end + 1} – ${end + 5} years`,
    signals,
  };
}

// ── Remedies ─────────────────────────────────────────────

export function buildRemedies(lagna: RashiResult, nakName: string, dasha: DashaSummary): string[] {
  return [
    `Daily mantra: Om ${lagna.lord}aya Namah (108 repetitions).`,
    `Nakshatra remedy: Observe prayer on ${nakName} days monthly.`,
    `Current dasha support: Strengthen ${dasha.current} through seva and sadhana.`,
    "Offer water to Surya after sunrise daily.",
    "Donate food on Saturdays/Thursdays.",
  ];
}

// ── Life Timeline ────────────────────────────────────────

export interface LifePhase {
  phase: string;
  positive: string;
  caution: string;
  solution: string;
}

export function buildLifeTimeline(dasha: DashaSummary, rows: PlanetRow[]): LifePhase[] {
  const c10 = rows.find((r) => r.house === 10)?.body || "Saturn";
  const c11 = rows.find((r) => r.house === 11)?.body || "Jupiter";

  return [
    { phase: "Age 0–12", positive: "Foundation years build core values.", caution: "Emotional conditioning impacts confidence.", solution: "Consistent discipline and positive guidance." },
    { phase: "Age 13–20", positive: "Identity formation and talent discovery.", caution: "Peer pressure may affect direction.", solution: "Choose one skill track early." },
    { phase: "Age 21–28", positive: `Career foundation via ${c10} influence.`, caution: "Pressure around financial independence.", solution: "Maintain savings discipline and mentorship." },
    { phase: "Age 29–36", positive: `Major growth via ${c11} patterns.`, caution: "Overwork may affect personal peace.", solution: "Balance ambition with health routine." },
    { phase: "Age 37–48", positive: "Peak responsibility and legacy building.", caution: "Decision fatigue and stress.", solution: "Delegate and protect family time." },
    { phase: "Age 49+", positive: `Spiritual maturity in ${dasha.next} cycles.`, caution: "Resistance to lifestyle change.", solution: "Daily prayer and moderate fitness." },
  ];
}
