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
