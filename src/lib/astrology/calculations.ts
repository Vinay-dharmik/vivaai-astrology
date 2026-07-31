import { RASHI, NAKSHATRAS, NAK_LORDS, VIM_ORDER, VIM_YEARS, BODY_ORDER } from "./constants";

// ── Basic Math & Angle Helpers ──────────────────────────────

export function normalizeDegree(v: number): number {
  return ((v % 360) + 360) % 360;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Convert a JS Date (UTC) to Julian Day number.
 */
export function julianDay(dateUtc: Date): number {
  return dateUtc.getTime() / 86_400_000 + 2_440_587.5;
}

/**
 * Lahiri Ayanamsa formula (Official Indian Calendar Reform Committee standard).
 * Ayanamsa at J2000.0 (2000 Jan 1.5) = 23° 51' 11.27" = 23.85313056°
 * Rate of precession = 50.2388" per year = 1.396042° per Julian century.
 */
export function lahiriAyanamsa(dateUtc: Date): number {
  const jd = julianDay(dateUtc);
  const T = (jd - 2_451_545.0) / 36525.0;
  return normalizeDegree(23.85313056 + 1.396042 * T + 0.000308 * T * T);
}

// ── Pure Astronomical Planetary Engine (Paul Schlyter / Meeus High Precision) ──

interface PlanetParam {
  N0: number; N1: number; // Longitude of ascending node (deg, deg/day)
  i0: number; i1: number; // Inclination (deg, deg/day)
  w0: number; w1: number; // Longitude of perihelion (deg, deg/day)
  a0: number; a1: number; // Semi-major axis (AU)
  e0: number; e1: number; // Eccentricity
  M0: number; M1: number; // Mean anomaly (deg, deg/day)
}

const PLANET_PARAMS: Record<string, PlanetParam> = {
  Mercury: { N0: 48.3313, N1: 0.0000324, i0: 7.0047, i1: 0.00000005, w0: 29.1241, w1: 0.0000101, a0: 0.387098, a1: 0, e0: 0.205635, e1: 0.0000000055, M0: 168.6562, M1: 4.0923344368 },
  Venus:   { N0: 76.6799, N1: 0.0000246, i0: 3.3946, i1: 0.000000027, w0: 54.884, w1: 0.0000048, a0: 0.72333, a1: 0, e0: 0.006773, e1: -0.0000000013, M0: 48.0052, M1: 1.6021302244 },
  Earth:   { N0: 0, N1: 0, i0: 0, i1: 0, w0: 102.9373, w1: 0.0000047, a0: 1.00000, a1: 0, e0: 0.016709, e1: -0.00000000115, M0: 356.047, M1: 0.9856002585 },
  Mars:    { N0: 49.5574, N1: 0.0000211, i0: 1.8497, i1: -0.000000018, w0: 286.5016, w1: 0.0000293, a0: 1.52368, a1: 0, e0: 0.093405, e1: 0.0000000024, M0: 18.6021, M1: 0.5240207766 },
  Jupiter: { N0: 100.4542, N1: 0.0000277, i0: 1.303, i1: -0.0000000156, w0: 273.8777, w1: 0.00001645, a0: 5.20256, a1: 0, e0: 0.048498, e1: 0.0000000044, M0: 19.895, M1: 0.0830853001 },
  Saturn:  { N0: 113.6655, N1: 0.0000238, i0: 2.4886, i1: -0.0000000108, w0: 339.3939, w1: 0.00002976, a0: 9.55475, a1: 0, e0: 0.055546, e1: -0.0000000034, M0: 316.967, M1: 0.0334442282 },
};

function getHelio3D(body: string, d: number) {
  const p = PLANET_PARAMS[body];
  const N = toRad(normalizeDegree(p.N0 + p.N1 * d));
  const i = toRad(p.i0 + p.i1 * d);
  const w = toRad(normalizeDegree(p.w0 + p.w1 * d));
  const a = p.a0 + p.a1 * d;
  const e = p.e0 + p.e1 * d;
  const M = toRad(normalizeDegree(p.M0 + p.M1 * d));

  let E = M;
  for (let k = 0; k < 10; k++) {
    E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  }

  const xv = a * (Math.cos(E) - e);
  const yv = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const v = Math.atan2(yv, xv);
  const r = Math.sqrt(xv * xv + yv * yv);

  const u = v + w;
  const x = r * (Math.cos(N) * Math.cos(u) - Math.sin(N) * Math.sin(u) * Math.cos(i));
  const y = r * (Math.sin(N) * Math.cos(u) + Math.cos(N) * Math.sin(u) * Math.cos(i));
  const z = r * (Math.sin(u) * Math.sin(i));

  return { x, y, z };
}

/**
 * Tropical Solar Longitude (Meeus Ch. 25).
 */
export function getSunTropicalLongitude(T: number): number {
  const L0 = normalizeDegree(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = normalizeDegree(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = toRad(M);

  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);

  const sunTrue = L0 + C;
  const omega = toRad(125.04 - 1934.136 * T);
  const apparentLon = sunTrue - 0.00569 - 0.00478 * Math.sin(omega);

  return normalizeDegree(apparentLon);
}

/**
 * Tropical Lunar Longitude (ELP-2000 / Meeus Ch. 47).
 */
export function getMoonTropicalLongitude(T: number): number {
  const Lprime = normalizeDegree(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + (T * T * T) / 538841.0);
  const D = normalizeDegree(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + (T * T * T) / 545868.0);
  const M = normalizeDegree(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + (T * T * T) / 24490000.0);
  const Mprime = normalizeDegree(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + (T * T * T) / 69699.0);
  const F = normalizeDegree(93.272095 * T + 483202.0175233 * T - 0.0036539 * T * T - (T * T * T) / 3526000.0);

  const Drad = toRad(D);
  const Mrad = toRad(M);
  const Mprad = toRad(Mprime);
  const Frad = toRad(F);

  let sumL = 0;
  sumL += 6288774 * Math.sin(Mprad);
  sumL += 1274027 * Math.sin(2 * Drad - Mprad);
  sumL += 658314 * Math.sin(2 * Drad);
  sumL += 213618 * Math.sin(2 * Mprad);
  sumL += -185116 * Math.sin(Mrad);
  sumL += -114332 * Math.sin(2 * Frad);
  sumL += 58793 * Math.sin(2 * Drad - 2 * Mprad);
  sumL += 57066 * Math.sin(2 * Drad - Mrad - Mprad);
  sumL += 53322 * Math.sin(2 * Drad + Mprad);
  sumL += 45758 * Math.sin(2 * Drad - Mrad);
  sumL += -40923 * Math.sin(Mrad + Mprad);
  sumL += -34720 * Math.sin(Drad);
  sumL += -30383 * Math.sin(Mprad + 2 * Frad);
  sumL += 15327 * Math.sin(2 * Drad - 2 * Frad);
  sumL += -12528 * Math.sin(Mprad - 2 * Frad);
  sumL += 10980 * Math.sin(Mprad + Mrad);
  sumL += 10675 * Math.sin(4 * Drad - Mprad);
  sumL += 10034 * Math.sin(3 * Mprad);

  return normalizeDegree(Lprime + sumL / 1_000_000);
}

/**
 * Lunar Node (Rahu) True Longitude.
 */
export function getRahuTropicalLongitude(T: number): number {
  const meanNode = normalizeDegree(125.0445222 - 1934.1362619 * T + 0.0020708 * T * T + (T * T * T) / 450000.0);
  const D = toRad(normalizeDegree(297.8501921 + 445267.1114034 * T));
  const Mprime = toRad(normalizeDegree(134.9633964 + 477198.8675055 * T));
  const F = toRad(normalizeDegree(93.272095 * T + 483202.0175233 * T));

  const trueNode = meanNode - 0.168 * Math.sin(2 * (F - D)) - 0.058 * Math.sin(2 * F) - 0.022 * Math.sin(2 * D) + 0.012 * Math.sin(2 * Mprime);
  return normalizeDegree(trueNode);
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

// ── Planet positions ─────────────────────────────────────

export interface PlanetRow {
  body: string;
  lon: number;
  rashi: string;
  rashiEnglish: string;
  house: number;
  signIndex: number;
  nakshatra?: string;
  nakshatraPada?: number;
  isRetrograde?: boolean;
  signDegree?: number;
  dignity?: string;
}

/**
 * Calculate sidereal longitudes for all 9 planets using pure astronomical formulas.
 */
export function planetarySiderealLongitudes(
  dateUtc: Date,
  ayanamsa: number
): Record<string, number> {
  const jd = julianDay(dateUtc);
  const T = (jd - 2_451_545.0) / 36525.0;
  const d = jd - 2451543.5; // Days since 1999 Dec 31.0

  const earth = getHelio3D("Earth", d);

  const trop: Record<string, number> = {
    Sun: getSunTropicalLongitude(T),
    Moon: getMoonTropicalLongitude(T),
    Rahu: getRahuTropicalLongitude(T),
  };
  trop.Ketu = normalizeDegree(trop.Rahu + 180);

  const PLANETS_3D = ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
  for (const body of PLANETS_3D) {
    const pos = getHelio3D(body, d);
    const xg = pos.x - earth.x;
    const yg = pos.y - earth.y;
    let lon = normalizeDegree(toDeg(Math.atan2(yg, xg)));

    // Major Resonances & Perturbations (Great Inequality, etc.)
    if (body === "Jupiter") {
      const Mj = toRad(normalizeDegree(PLANET_PARAMS.Jupiter.M0 + PLANET_PARAMS.Jupiter.M1 * d));
      const Ms = toRad(normalizeDegree(PLANET_PARAMS.Saturn.M0 + PLANET_PARAMS.Saturn.M1 * d));
      lon += -0.332 * Math.sin(2 * Mj - 5 * Ms - toRad(67.6)) - 0.059 * Math.sin(3 * Mj - 2 * Ms);
    }
    if (body === "Saturn") {
      const Mj = toRad(normalizeDegree(PLANET_PARAMS.Jupiter.M0 + PLANET_PARAMS.Jupiter.M1 * d));
      const Ms = toRad(normalizeDegree(PLANET_PARAMS.Saturn.M0 + PLANET_PARAMS.Saturn.M1 * d));
      lon += 0.812 * Math.sin(2 * Mj - 5 * Ms - toRad(67.6)) - 0.229 * Math.cos(2 * Mj - 4 * Ms);
    }

    trop[body] = lon;
  }

  const sidereal: Record<string, number> = {};
  for (const body of BODY_ORDER) {
    sidereal[body] = normalizeDegree(trop[body] - ayanamsa);
  }

  return sidereal;
}

/**
 * Detect retrograde status by comparing longitude at (dateUtc) vs (dateUtc - 6 hours).
 */
export function detectRetrogrades(dateUtc: Date): Record<string, boolean> {
  const ayanamsa = lahiriAyanamsa(dateUtc);
  const t1 = planetarySiderealLongitudes(dateUtc, ayanamsa);
  const t0 = planetarySiderealLongitudes(new Date(dateUtc.getTime() - 6 * 3600 * 1000), ayanamsa);

  const result: Record<string, boolean> = {
    Sun: false,
    Moon: false,
    Rahu: true,
    Ketu: true,
  };

  const RETRO_BODIES = ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
  for (const body of RETRO_BODIES) {
    let diff = t1[body] - t0[body];
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    result[body] = diff < 0;
  }

  return result;
}

// ── Ascendant (Lagna) ───────────────────────────────────

/**
 * Calculate sidereal ascendant (Lagna) using Greenwich Sidereal Time & spherical trigonometry.
 */
export function calcAscendantSidereal(
  dateUtc: Date,
  lat: number,
  lon: number,
  ayanamsa: number
): number {
  const jd = julianDay(dateUtc);
  const T = (jd - 2_451_545.0) / 36525.0;

  // Greenwich Mean Sidereal Time (GMST in degrees)
  const gmstDeg = normalizeDegree(280.46061837 + 360.98564736629 * (jd - 2_451_545.0) + 0.000387933 * T * T);
  // Local Sidereal Time (LST in radians)
  const lstRad = toRad(normalizeDegree(gmstDeg + lon));
  const phiRad = toRad(lat);

  // Mean Obliquity of the Ecliptic (eps in radians)
  const epsDeg = 23.4392911 - 0.0130042 * T;
  const epsRad = toRad(epsDeg);

  // Ascendant formula (Meeus Ch. 14 / Paul Schlyter):
  const y = Math.cos(lstRad);
  const x = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(phiRad) * Math.sin(epsRad);
  const ascTropical = normalizeDegree(toDeg(Math.atan2(y, x)));

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
    hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(date).filter((p) => p.type !== "literal").map((p) => [p.type, p.value])
  );
  const hour = +parts.hour === 24 ? 0 : +parts.hour;
  const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, hour, +parts.minute, +parts.second);
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

    const exalted: Record<string, string> = { Sun: "Aries", Moon: "Taurus", Mars: "Capricorn", Mercury: "Virgo", Jupiter: "Cancer", Venus: "Pisces", Saturn: "Libra" };
    const debilitated: Record<string, string> = { Sun: "Libra", Moon: "Scorpio", Mars: "Cancer", Mercury: "Pisces", Jupiter: "Capricorn", Venus: "Virgo", Saturn: "Aries" };
    const own: Record<string, string[]> = { Sun: ["Leo"], Moon: ["Cancer"], Mars: ["Aries", "Scorpio"], Mercury: ["Gemini", "Virgo"], Jupiter: ["Sagittarius", "Pisces"], Venus: ["Taurus", "Libra"], Saturn: ["Capricorn", "Aquarius"] };

    let dignity = "Normal";
    if (exalted[planet] === rashi.english) dignity = "Exalted ⬆";
    else if (debilitated[planet] === rashi.english) dignity = "Debilitated ⬇";
    else if (own[planet]?.includes(rashi.english)) dignity = "Own Sign ★";

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

// ── Vimshottari Antardasha ────────────────────────────────

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

export function getHouseStrength(house: number): "excellent" | "good" | "neutral" | "challenging" {
  if ([1, 4, 5, 7, 9, 10, 11].includes(house)) return "excellent";
  if ([2, 3].includes(house)) return "good";
  if ([6, 8, 12].includes(house)) return "challenging";
  return "neutral";
}
