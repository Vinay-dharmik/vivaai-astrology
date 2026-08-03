/**
 * Ashtakavarga — Brihat Parashara Hora Shastra, chapters 66–70.
 *
 * Each of the seven planets is scored against eight reference points (the
 * other six, itself, and the Ascendant). For every reference point, classical
 * tradition lists the houses counted *from that point* in which the planet
 * gives a benefic result; each match contributes one bindu.
 *
 * The result answers a question a birth chart alone cannot: not "is this house
 * occupied by something good" but "how much support does this sign have across
 * the whole chart". A Sarvashtakavarga total of 30+ in a sign marks it as
 * well-supplied; under 25 it struggles regardless of what sits there.
 *
 * The seven tables below sum to 337 bindus, which is the check figure the
 * classical texts give for a complete Sarvashtakavarga.
 */

export const AV_PLANETS = [
  "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn",
] as const;

export type AvPlanet = (typeof AV_PLANETS)[number];

/** The eight reference points, in the order the classical tables list them. */
const CONTRIBUTORS = [
  "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Lagna",
] as const;

type Contributor = (typeof CONTRIBUTORS)[number];

/**
 * Benefic houses, counted from each contributor, for each planet's own
 * Ashtakavarga. Transcribed from BPHS ch. 66.
 */
const BENEFIC_PLACES: Record<AvPlanet, Record<Contributor, number[]>> = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11],
    Moon: [3, 6, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [3, 5, 6, 9, 10, 11, 12],
    Jupiter: [5, 6, 9, 11],
    Venus: [6, 7, 12],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [3, 4, 6, 10, 11, 12],
  },
  Moon: {
    Sun: [3, 6, 7, 8, 10, 11],
    Moon: [1, 3, 6, 7, 10, 11],
    Mars: [2, 3, 5, 6, 9, 10, 11],
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    Jupiter: [1, 4, 7, 8, 10, 11, 12],
    Venus: [3, 4, 5, 7, 9, 10, 11],
    Saturn: [3, 5, 6, 11],
    Lagna: [3, 6, 10, 11],
  },
  Mars: {
    Sun: [3, 5, 6, 10, 11],
    Moon: [3, 6, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [3, 5, 6, 11],
    Jupiter: [6, 10, 11, 12],
    Venus: [6, 8, 11, 12],
    Saturn: [1, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 3, 6, 10, 11],
  },
  Mercury: {
    Sun: [5, 6, 9, 11, 12],
    Moon: [2, 4, 6, 8, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    Jupiter: [6, 8, 11, 12],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 2, 4, 6, 8, 10, 11],
  },
  Jupiter: {
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    Moon: [2, 5, 7, 9, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    Venus: [2, 5, 6, 9, 10, 11],
    Saturn: [3, 5, 6, 12],
    Lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  Venus: {
    Sun: [8, 11, 12],
    Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Mars: [3, 5, 6, 9, 11, 12],
    Mercury: [3, 5, 6, 9, 11],
    Jupiter: [5, 8, 9, 10, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    Saturn: [3, 4, 5, 8, 9, 10, 11],
    Lagna: [1, 2, 3, 4, 5, 8, 9, 11],
  },
  Saturn: {
    Sun: [1, 2, 4, 7, 8, 10, 11],
    Moon: [3, 6, 11],
    Mars: [3, 5, 6, 10, 11, 12],
    Mercury: [6, 8, 9, 10, 11, 12],
    Jupiter: [5, 6, 11, 12],
    Venus: [6, 11, 12],
    Saturn: [3, 5, 6, 11],
    Lagna: [1, 3, 4, 6, 10, 11],
  },
};

export interface BhinnaAshtakavarga {
  planet: AvPlanet;
  /** Bindus per sign, index 0 = Aries. */
  bindusBySign: number[];
  total: number;
}

export interface AshtakavargaResult {
  bhinna: BhinnaAshtakavarga[];
  /** Sarvashtakavarga: the seven Bhinna charts summed, per sign. */
  sarvaBySign: number[];
  sarvaTotal: number;
  /** Sign indices with the strongest and weakest support. */
  strongestSigns: number[];
  weakestSigns: number[];
}

/**
 * @param signIndexOf Sign index (0 = Aries) for each of the seven planets and
 *                    the key "Lagna".
 */
export function computeAshtakavarga(
  signIndexOf: Record<string, number>
): AshtakavargaResult {
  const bhinna = AV_PLANETS.map((planet) => {
    const bindusBySign = new Array(12).fill(0);

    for (const contributor of CONTRIBUTORS) {
      const from = signIndexOf[contributor];
      if (from === undefined) continue;
      for (const houseFromContributor of BENEFIC_PLACES[planet][contributor]) {
        // "nth house from" is 1-indexed and inclusive of the contributor's sign.
        bindusBySign[(from + houseFromContributor - 1) % 12] += 1;
      }
    }

    return {
      planet,
      bindusBySign,
      total: bindusBySign.reduce((a, b) => a + b, 0),
    };
  });

  const sarvaBySign = new Array(12).fill(0);
  for (const b of bhinna) {
    for (let s = 0; s < 12; s++) sarvaBySign[s] += b.bindusBySign[s];
  }

  const max = Math.max(...sarvaBySign);
  const min = Math.min(...sarvaBySign);

  return {
    bhinna,
    sarvaBySign,
    sarvaTotal: sarvaBySign.reduce((a, b) => a + b, 0),
    strongestSigns: sarvaBySign.map((v, i) => (v === max ? i : -1)).filter((i) => i >= 0),
    weakestSigns: sarvaBySign.map((v, i) => (v === min ? i : -1)).filter((i) => i >= 0),
  };
}

/** Plain-language reading of a Sarvashtakavarga score for one sign. */
export function sarvaVerdict(bindus: number): { label: string; tone: "good" | "mixed" | "poor" } {
  if (bindus >= 33) return { label: "Very well supported", tone: "good" };
  if (bindus >= 29) return { label: "Well supported", tone: "good" };
  if (bindus >= 25) return { label: "Average support", tone: "mixed" };
  if (bindus >= 21) return { label: "Thin support", tone: "poor" };
  return { label: "Poorly supported", tone: "poor" };
}

/** Reading of a planet's own bindus in the sign it occupies. */
export function bhinnaVerdict(bindus: number): { label: string; tone: "good" | "mixed" | "poor" } {
  if (bindus >= 6) return { label: "Acts freely here", tone: "good" };
  if (bindus >= 4) return { label: "Works with effort", tone: "mixed" };
  return { label: "Obstructed here", tone: "poor" };
}
