import { RASHI, NAKSHATRAS, NAK_LORDS, VIM_ORDER, VIM_YEARS, BODY_ORDER } from "./constants";

// ── Helpers ──────────────────────────────────────────────

export function normalizeDegree(v: number): number {
  return ((v % 360) + 360) % 360;
}

function julianDay(dateUtc: Date): number {
  return dateUtc.getTime() / 86_400_000 + 2_440_587.5;
}

// ── Ayanamsa ─────────────────────────────────────────────

export function lahiriAyanamsa(dateUtc: Date): number {
  const jd = julianDay(dateUtc);
  const t = (jd - 2_451_545.0) / 36525;
  return normalizeDegree(22.460148 + 1.396042 * t + 0.000087 * t * t);
}

// ── Rashi / Nakshatra ────────────────────────────────────

export interface RashiResult {
  signIndex: number;
  signDegree: number;
  name: string;
  english: string;
  lord: string;
  element: string;
  symbol: string;
}

export function getRashiInfo(siderealLon: number): RashiResult {
  const deg = normalizeDegree(siderealLon);
  const idx = Math.floor(deg / 30);
  return { signIndex: idx, signDegree: deg % 30, ...RASHI[idx] };
}

export interface NakshatraResult {
  name: string;
  lord: string;
  pada: number;
  index: number;
}

export function getNakshatraInfo(siderealMoonLon: number): NakshatraResult {
  const seg = normalizeDegree(siderealMoonLon) / (13 + 1 / 3);
  const idx = Math.floor(seg);
  const pada = Math.floor((seg - idx) * 4) + 1;
  return { name: NAKSHATRAS[idx], lord: NAK_LORDS[idx], pada, index: idx };
}

// ── Rahu / Ketu ──────────────────────────────────────────

function calcAscendingNodeLon(dateUtc: Date): number {
  const jd = julianDay(dateUtc);
  const t = (jd - 2_451_545.0) / 36525;
  return normalizeDegree(
    125.04452 - 1934.136261 * t + 0.0020708 * t * t + (t * t * t) / 450000
  );
}

// ── Planet positions (requires astronomy-engine) ─────────

export interface PlanetRow {
  body: string;
  lon: number;
  rashi: string;
  rashiEnglish: string;
  house: number;
  signIndex: number;
  // Enriched fields populated by KundaliForm — optional so buildPlanetRows stays valid
  nakshatra?: string;
  nakshatraPada?: number;
  isRetrograde?: boolean;
  signDegree?: number;
  dignity?: string;
}

function eclipticLon(vec: unknown, Astro: any): number {
  const ecl = Astro.Ecliptic(vec);
  return normalizeDegree(ecl.elon);
}

export function planetarySiderealLongitudes(
  dateUtc: Date,
  ayanamsa: number,
  Astro: any
): Record<string, number> {
  const geoLon = (body: string) =>
    eclipticLon(Astro.GeoVector(body, dateUtc, true), Astro);

  const tropical: Record<string, number> = {
    Sun: geoLon("Sun"),
    Moon: geoLon("Moon"),
    Mercury: geoLon("Mercury"),
    Venus: geoLon("Venus"),
    Mars: geoLon("Mars"),
    Jupiter: geoLon("Jupiter"),
    Saturn: geoLon("Saturn"),
    Rahu: calcAscendingNodeLon(dateUtc),
    Ketu: normalizeDegree(calcAscendingNodeLon(dateUtc) + 180),
  };

  const sidereal: Record<string, number> = {};
  for (const body of BODY_ORDER) {
    sidereal[body] = normalizeDegree(tropical[body] - ayanamsa);
  }
  return sidereal;
}

/**
 * Detect retrograde status for each planet using ecliptic longitude velocity.
 * A planet is retrograde when its apparent geocentric ecliptic longitude decreases.
 * Sun and Moon are never retrograde. Rahu/Ketu are always retrograde (mean motion).
 */
export function detectRetrogrades(dateUtc: Date, Astro: any): Record<string, boolean> {
  const RETRO_BODIES = ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
  const result: Record<string, boolean> = {
    Sun: false,
    Moon: false,
    Rahu: true,   // Rahu always moves retrograde
    Ketu: true,   // Ketu always moves retrograde
  };

  // Check velocity by computing position 1 hour apart
  const dt = 1 / 24; // 1 hour in days
  const future = new Date(dateUtc.getTime() + dt * 86_400_000);

  for (const body of RETRO_BODIES) {
    const lon1 = eclipticLon(Astro.GeoVector(body, dateUtc, true), Astro);
    const lon2 = eclipticLon(Astro.GeoVector(body, future, true), Astro);
    // Handle wrap-around at 360°/0°
    let diff = lon2 - lon1;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    result[body] = diff < 0;
  }

  return result;
}

// ── Ascendant ────────────────────────────────────────────

export function calcAscendantSidereal(
  dateUtc: Date,
  lat: number,
  lon: number,
  ayanamsa: number,
  Astro: any
): number {
  const gstHours = Astro.SiderealTime(dateUtc);
  const theta = (normalizeDegree(gstHours * 15 + lon) * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const epsilon = (23.4392911 * Math.PI) / 180;

  const y = -Math.cos(theta);
  const x = Math.sin(theta) * Math.cos(epsilon) + Math.tan(phi) * Math.sin(epsilon);
  const ascTropical = normalizeDegree((Math.atan2(y, x) * 180) / Math.PI);
  return normalizeDegree(ascTropical - ayanamsa);
}

// ── Houses ───────────────────────────────────────────────

export function houseFromPlanet(planetSignIdx: number, lagnaSignIdx: number): number {
  return ((planetSignIdx - lagnaSignIdx + 12) % 12) + 1;
}

// ── Vimshottari Dasha ────────────────────────────────────

export interface DashaSummary {
  current: string;
  currentRange: string;
  next: string;
  nextStartsAt: string;
}

export function getVimshottariSummary(nakLord: string, ageYears: number): DashaSummary {
  const startIdx = Math.max(VIM_ORDER.indexOf(nakLord), 0);
  let cumulative = 0;

  for (let i = 0; i < 18; i++) {
    const lord = VIM_ORDER[(startIdx + i) % VIM_ORDER.length];
    const years = VIM_YEARS[lord];
    if (ageYears <= cumulative + years) {
      return {
        current: lord,
        currentRange: `${cumulative.toFixed(1)} – ${(cumulative + years).toFixed(1)} yrs`,
        next: VIM_ORDER[(startIdx + i + 1) % VIM_ORDER.length],
        nextStartsAt: (cumulative + years).toFixed(1),
      };
    }
    cumulative += years;
  }
  return { current: "Mercury", currentRange: "N/A", next: "Ketu", nextStartsAt: "N/A" };
}

// ── Age ──────────────────────────────────────────────────

export function getAgeYears(dob: string): number {
  const birth = new Date(`${dob}T00:00:00`);
  return Math.max(0, (Date.now() - birth.getTime()) / (365.2425 * 86_400_000));
}

// ── Build planet rows ────────────────────────────────────

export function buildPlanetRows(
  siderealLons: Record<string, number>,
  lagnaSignIdx: number
): PlanetRow[] {
  return BODY_ORDER.map((body) => {
    const lon = siderealLons[body];
    const rashi = getRashiInfo(lon);
    return {
      body,
      lon,
      rashi: rashi.name,
      rashiEnglish: rashi.english,
      house: houseFromPlanet(rashi.signIndex, lagnaSignIdx),
      signIndex: rashi.signIndex,
    };
  });
}

// ── Geocoding ────────────────────────────────────────────

export interface GeoResult {
  latitude: number;
  longitude: number;
  timezone: string;
  placeLabel: string;
}

export async function geocodePlace(place: string): Promise<GeoResult> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to geocode place");
  const data = await res.json();
  if (!data.results?.length) throw new Error("Place not found");
  const best = data.results[0];
  return {
    latitude: best.latitude,
    longitude: best.longitude,
    timezone: best.timezone || "UTC",
    placeLabel: [best.name, best.admin1, best.country].filter(Boolean).join(", "),
  };
}

// ── Timezone ─────────────────────────────────────────────

function getTimezoneOffsetMin(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(date).filter((p) => p.type !== "literal").map((p) => [p.type, p.value])
  );
  const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return (asUTC - date.getTime()) / 60000;
}

export function zonedBirthToUtc(dob: string, hour24: number, minute: number, tz: string): Date {
  const [y, m, d] = dob.split("-").map(Number);
  let guess = Date.UTC(y, m - 1, d, hour24, minute, 0);
  for (let i = 0; i < 3; i++) {
    const off = getTimezoneOffsetMin(new Date(guess), tz);
    guess = Date.UTC(y, m - 1, d, hour24, minute, 0) - off * 60000;
  }
  return new Date(guess);
}

export function to24Hour(h12: number, min: number, meridiem: string) {
  let hour = h12 % 12;
  if (meridiem === "PM") hour += 12;
  return { hour24: hour, minute: min };
}

// ── Navamsa (D9) Chart ────────────────────────────────────
// Divides each rashi into 9 navamsas of 3°20' (200') each.
// The starting navamsa sign depends on the main sign's element:
//   Fire  → starts from Aries  (0)
//   Earth → starts from Capricorn (9)
//   Air   → starts from Libra  (6)
//   Water → starts from Cancer (3)

export interface NavamsaResult {
  planet: string;
  navamsaSignIndex: number;
  navamsaSign: string;
  navamsaEnglish: string;
  navamsaLord: string;
  dignity: string;
}

const NAVAMSA_START: Record<string, number> = {
  Fire: 0, Earth: 9, Air: 6, Water: 3,
};

export function calcNavamsa(siderealLons: Record<string, number>): NavamsaResult[] {
  return BODY_ORDER.map((planet) => {
    const lon = normalizeDegree(siderealLons[planet]);
    const signIdx = Math.floor(lon / 30);
    const degInSign = lon % 30;
    const navamsaIdx = Math.floor(degInSign / (30 / 9)); // 0–8
    const element = RASHI[signIdx].element;
    const startSign = NAVAMSA_START[element] ?? 0;
    const navamsaSignIndex = (startSign + navamsaIdx) % 12;
    const rashi = RASHI[navamsaSignIndex];

    // Dignity in navamsa
    const exalted: Record<string, string> = { Sun: "Aries", Moon: "Taurus", Mars: "Capricorn", Mercury: "Virgo", Jupiter: "Cancer", Venus: "Pisces", Saturn: "Libra" };
    const debilitated: Record<string, string> = { Sun: "Libra", Moon: "Scorpio", Mars: "Cancer", Mercury: "Pisces", Jupiter: "Capricorn", Venus: "Virgo", Saturn: "Aries" };
    const own: Record<string, string[]> = { Sun: ["Leo"], Moon: ["Cancer"], Mars: ["Aries", "Scorpio"], Mercury: ["Gemini", "Virgo"], Jupiter: ["Sagittarius", "Pisces"], Venus: ["Taurus", "Libra"], Saturn: ["Capricorn", "Aquarius"] };

    let dignity = "Normal";
    if (exalted[planet] === rashi.english) dignity = "Exalted ⬆";
    else if (debilitated[planet] === rashi.english) dignity = "Debilitated ⬇";
    else if (own[planet]?.includes(rashi.english)) dignity = "Own Sign ★";

    // Vargottama: planet in same sign in both D1 and D9 — very auspicious
    if (navamsaSignIndex === signIdx) dignity = "Vargottama ✦";

    return {
      planet,
      navamsaSignIndex,
      navamsaSign: rashi.name,
      navamsaEnglish: rashi.english,
      navamsaLord: rashi.lord,
      dignity,
    };
  });
}

// ── Proper Vimshottari Antardasha ─────────────────────────
// Sub-period duration = (MahaDasha_years × AntarDasha_years) / 120

export interface DetailedDasha {
  mahaLord: string;
  mahaRange: string;
  mahaRemaining: string;
  antarLord: string;
  antarRange: string;
  nextMahaLord: string;
  nextMahaStartAge: string;
}

export function getDetailedVimshottari(nakLord: string, ageYears: number): DetailedDasha {
  const totalCycle = 120;
  const startIdx = Math.max(VIM_ORDER.indexOf(nakLord), 0);
  let cumulative = 0;
  let mahaIdx = startIdx;
  let mahaStart = 0;

  for (let i = 0; i < 18; i++) {
    const lord = VIM_ORDER[(startIdx + i) % 9];
    const years = VIM_YEARS[lord];
    if (ageYears <= cumulative + years) {
      mahaIdx = (startIdx + i) % 9;
      mahaStart = cumulative;
      break;
    }
    cumulative += years;
  }

  const mahaLord = VIM_ORDER[mahaIdx];
  const mahaYears = VIM_YEARS[mahaLord];
  const mahaEnd = mahaStart + mahaYears;
  const ageInMaha = ageYears - mahaStart;

  // Calculate antardasha
  let antarStart = 0;
  let antarLord = mahaLord;

  for (let j = 0; j < 9; j++) {
    const aIdx = (mahaIdx + j) % 9;
    const aLord = VIM_ORDER[aIdx];
    const aYears = (mahaYears * VIM_YEARS[aLord]) / totalCycle;
    if (ageInMaha <= antarStart + aYears) {
      antarLord = aLord;
      break;
    }
    antarStart += aYears;
  }

  const nextMahaLord = VIM_ORDER[(mahaIdx + 1) % 9];

  return {
    mahaLord,
    mahaRange: `${mahaStart.toFixed(1)} – ${mahaEnd.toFixed(1)} yrs`,
    mahaRemaining: `${Math.max(0, mahaEnd - ageYears).toFixed(1)} yrs remaining`,
    antarLord,
    antarRange: `Currently in ${mahaLord}–${antarLord} period`,
    nextMahaLord,
    nextMahaStartAge: mahaEnd.toFixed(1),
  };
}

// ── Planet Dignity Lookup ─────────────────────────────────

export function getPlanetDignity(body: string, signEnglish: string): string {
  const exalted: Record<string, string> = { Sun: "Aries", Moon: "Taurus", Mars: "Capricorn", Mercury: "Virgo", Jupiter: "Cancer", Venus: "Pisces", Saturn: "Libra" };
  const debilitated: Record<string, string> = { Sun: "Libra", Moon: "Scorpio", Mars: "Cancer", Mercury: "Pisces", Jupiter: "Capricorn", Venus: "Virgo", Saturn: "Aries" };
  const own: Record<string, string[]> = { Sun: ["Leo"], Moon: ["Cancer"], Mars: ["Aries", "Scorpio"], Mercury: ["Gemini", "Virgo"], Jupiter: ["Sagittarius", "Pisces"], Venus: ["Taurus", "Libra"], Saturn: ["Capricorn", "Aquarius"] };
  if (exalted[body] === signEnglish) return "Exalted ⬆";
  if (debilitated[body] === signEnglish) return "Debilitated ⬇";
  if (own[body]?.includes(signEnglish)) return "Own Sign ★";
  return "Normal";
}

// ── Lagna Lord Placement Strength ────────────────────────
// Returns a plain-text strength label for a planet's house position

export function getHouseStrength(house: number): "excellent" | "good" | "neutral" | "challenging" {
  if ([1, 4, 5, 7, 9, 10, 11].includes(house)) return "excellent";
  if ([2, 3].includes(house)) return "good";
  if ([6, 8, 12].includes(house)) return "challenging";
  return "neutral";
}
