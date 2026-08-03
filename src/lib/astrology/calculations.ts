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

/** Days light takes to cross one astronomical unit (499.005 s). */
const LIGHT_DAYS_PER_AU = 0.005775518;

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
  let x = r * (Math.cos(N) * Math.cos(u) - Math.sin(N) * Math.sin(u) * Math.cos(i));
  let y = r * (Math.sin(N) * Math.cos(u) + Math.cos(N) * Math.sin(u) * Math.cos(i));
  const z = r * (Math.sin(u) * Math.sin(i));

  // Jupiter and Saturn are locked in the 5:2 "Great Inequality" resonance,
  // which pure two-body Kepler elements cannot express — the error reaches
  // ~0.8° for Saturn. Apply Schlyter's perturbation series to the
  // *heliocentric* longitude by rotating the orbital position about the
  // ecliptic pole, then let the caller take the geocentric difference.
  const dLon = helioLongitudePerturbation(body, d);
  if (dLon !== 0) {
    const c = Math.cos(dLon);
    const s = Math.sin(dLon);
    const xr = x * c - y * s;
    const yr = x * s + y * c;
    x = xr;
    y = yr;
  }

  return { x, y, z };
}

/**
 * Heliocentric longitude corrections for Jupiter and Saturn, in radians.
 * Paul Schlyter, "Computing planetary positions", section on perturbations.
 */
function helioLongitudePerturbation(body: string, d: number): number {
  if (body !== "Jupiter" && body !== "Saturn") return 0;

  const Mj = toRad(normalizeDegree(PLANET_PARAMS.Jupiter.M0 + PLANET_PARAMS.Jupiter.M1 * d));
  const Ms = toRad(normalizeDegree(PLANET_PARAMS.Saturn.M0 + PLANET_PARAMS.Saturn.M1 * d));

  let deg = 0;
  if (body === "Jupiter") {
    deg =
      -0.332 * Math.sin(2 * Mj - 5 * Ms - toRad(67.6))
      - 0.056 * Math.sin(2 * Mj - 2 * Ms + toRad(21))
      + 0.042 * Math.sin(3 * Mj - 5 * Ms + toRad(21))
      - 0.036 * Math.sin(Mj - 2 * Ms)
      + 0.022 * Math.cos(Mj - Ms)
      + 0.023 * Math.sin(2 * Mj - 3 * Ms + toRad(52))
      - 0.016 * Math.sin(Mj - 5 * Ms - toRad(69));
  } else {
    deg =
      0.812 * Math.sin(2 * Mj - 5 * Ms - toRad(67.6))
      - 0.229 * Math.cos(2 * Mj - 4 * Ms - toRad(2))
      + 0.119 * Math.sin(Mj - 2 * Ms - toRad(3))
      + 0.046 * Math.sin(2 * Mj - 6 * Ms - toRad(69))
      + 0.014 * Math.sin(Mj - 3 * Ms + toRad(32));
  }

  return toRad(deg);
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
 * The four fundamental lunar arguments (Meeus Ch. 47, eqs. 47.1–47.5), in degrees.
 *
 * These are shared by the longitude series and the node, so they live in one
 * place — an earlier version recomputed them inline and lost the constant term
 * of F, which threw every F-dependent term off by a full cycle.
 */
function lunarArguments(T: number) {
  return {
    // Moon's mean longitude
    Lprime: normalizeDegree(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + (T * T * T) / 538841.0 - (T * T * T * T) / 65194000.0),
    // Mean elongation of the Moon from the Sun
    D: normalizeDegree(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + (T * T * T) / 545868.0 - (T * T * T * T) / 113065000.0),
    // Sun's mean anomaly
    M: normalizeDegree(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + (T * T * T) / 24490000.0),
    // Moon's mean anomaly
    Mprime: normalizeDegree(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + (T * T * T) / 69699.0 - (T * T * T * T) / 14712000.0),
    // Moon's argument of latitude
    F: normalizeDegree(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T - (T * T * T) / 3526000.0 + (T * T * T * T) / 863310000.0),
  };
}

/**
 * Periodic terms for the Moon's longitude — Meeus, Astronomical Algorithms,
 * Table 47.A, column Σl. Each row is [D, M, M', F, coefficient].
 *
 * Coefficients are in units of 1e-6 degrees. The full 60-term series is used
 * rather than a truncation: the Moon fixes the Rashi, the Nakshatra, the Pada
 * and the starting balance of the Vimshottari Dasha, so a tenth of a degree
 * here is the difference between two different Dasha timelines.
 */
const MOON_LON_TERMS: readonly (readonly [number, number, number, number, number])[] = [
  [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314],
  [0, 0, 2, 0, 213618], [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332],
  [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066], [2, 0, 1, 0, 53322],
  [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528],
  [0, 0, 1, -2, 10980], [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034],
  [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888], [2, 1, 0, 0, -6766],
  [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665],
  [0, 1, -2, 0, -2689], [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390],
  [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236], [0, 1, 2, 0, -2120],
  [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048], [2, 0, 1, -2, -1773],
  [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110],
  [3, 0, -1, 0, -892], [2, 1, 1, 0, -810], [4, -1, -2, 0, 759],
  [0, 2, -1, 0, -713], [2, 2, -1, 0, -700], [2, 1, -2, 0, 691],
  [2, -1, 0, -2, 596], [4, 0, 1, 0, 549], [0, 0, 4, 0, 537],
  [4, -1, 0, 0, 520], [1, 0, -2, 0, -487], [2, 1, 0, -2, -399],
  [0, 0, 2, -2, -381], [1, 1, 1, 0, 351], [3, 0, -2, 0, -340],
  [4, 0, -3, 0, 330], [2, -1, 2, 0, 327], [0, 2, 1, 0, -323],
  [1, 1, -1, 0, 299], [2, 0, 3, 0, 294],
] as const;

/**
 * Tropical (apparent) Lunar Longitude — Meeus Ch. 47.
 *
 * Accurate to roughly 10 arcseconds, which is well inside the precision the
 * chart actually needs (a Nakshatra Pada spans 3°20').
 */
export function getMoonTropicalLongitude(T: number): number {
  const { Lprime, D, M, Mprime, F } = lunarArguments(T);

  const Drad = toRad(D);
  const Mrad = toRad(M);
  const Mprad = toRad(Mprime);
  const Frad = toRad(F);

  // Correction for the decreasing eccentricity of Earth's orbit. Terms in M
  // are scaled by E, terms in 2M by E² (Meeus eq. 47.6).
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;

  let sumL = 0;
  for (const [dD, dM, dMp, dF, coeff] of MOON_LON_TERMS) {
    const arg = dD * Drad + dM * Mrad + dMp * Mprad + dF * Frad;
    const eFactor = dM === 0 ? 1 : Math.abs(dM) === 1 ? E : E * E;
    sumL += coeff * eFactor * Math.sin(arg);
  }

  // Additive terms from Venus (A1), Jupiter (A2) and the flattening of the
  // Earth (A3) — Meeus p. 338.
  const A1 = toRad(normalizeDegree(119.75 + 131.849 * T));
  const A2 = toRad(normalizeDegree(53.09 + 479264.290 * T));
  sumL += 3958 * Math.sin(A1);
  sumL += 1962 * Math.sin(toRad(Lprime) - Frad);
  sumL += 318 * Math.sin(A2);

  return normalizeDegree(Lprime + sumL / 1_000_000);
}

/**
 * Lunar Node (Rahu) True Longitude — Meeus Ch. 47, eq. 47.7 plus the
 * mean-to-true node correction.
 *
 * Vedic astrology conventionally uses the *mean* node, but the true node is
 * what a modern ephemeris reports and what AstroSage/Jagannatha Hora show by
 * default, so we return the true node and let callers decide.
 */
export function getRahuTropicalLongitude(T: number): number {
  const meanNode = normalizeDegree(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 467441.0 - (T * T * T * T) / 60616000.0);
  const { D, M, Mprime, F } = lunarArguments(T);

  const Drad = toRad(D);
  const Mrad = toRad(M);
  const Mprad = toRad(Mprime);
  const Frad = toRad(F);

  const trueNode =
    meanNode
    - 1.4979 * Math.sin(2 * (Drad - Frad))
    - 0.1500 * Math.sin(Mrad)
    - 0.1226 * Math.sin(2 * Drad)
    + 0.1176 * Math.sin(2 * Frad)
    - 0.0801 * Math.sin(2 * (Mprad - Frad));

  return normalizeDegree(trueNode);
}

/** Mean lunar node — the classical Vedic Rahu. */
export function getRahuMeanTropicalLongitude(T: number): number {
  return normalizeDegree(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 467441.0 - (T * T * T * T) / 60616000.0);
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
    // Light-time correction: we see the planet where it was when the light
    // left it. Saturn is ~80 light-minutes away, which is a real offset at
    // the precision we are claiming.
    let pos = getHelio3D(body, d);
    for (let iter = 0; iter < 2; iter++) {
      const dx = pos.x - earth.x;
      const dy = pos.y - earth.y;
      const dz = pos.z - earth.z;
      const distanceAu = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const lightDays = distanceAu * LIGHT_DAYS_PER_AU;
      pos = getHelio3D(body, d - lightDays);
    }

    const xg = pos.x - earth.x;
    const yg = pos.y - earth.y;
    trop[body] = normalizeDegree(toDeg(Math.atan2(yg, xg)));
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

// ── Daily motion ─────────────────────────────────────────

/**
 * Long-run mean geocentric daily motion, in degrees.
 *
 * Mercury and Venus orbit inside Earth's, so however wildly they loop, their
 * mean apparent rate is the Sun's. The superior planets keep their own.
 */
export const MEAN_DAILY_MOTION: Record<string, number> = {
  Sun: 0.9856,
  Moon: 13.1764,
  Mercury: 0.9856,
  Venus: 0.9856,
  Mars: 0.5240,
  Jupiter: 0.0831,
  Saturn: 0.0334,
  Rahu: 0.0529,
  Ketu: 0.0529,
};

/**
 * Apparent daily motion of each body, signed — negative when retrograde.
 * Central difference over ±6 hours, which is short enough to stay linear even
 * for the Moon and long enough to stay clear of rounding noise.
 */
export function planetaryDailySpeeds(dateUtc: Date): Record<string, number> {
  const h6 = 6 * 3600 * 1000;
  const before = new Date(dateUtc.getTime() - h6);
  const after = new Date(dateUtc.getTime() + h6);

  const a = planetarySiderealLongitudes(before, lahiriAyanamsa(before));
  const b = planetarySiderealLongitudes(after, lahiriAyanamsa(after));

  const out: Record<string, number> = {};
  for (const body of BODY_ORDER) {
    let diff = b[body] - a[body];
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    out[body] = diff * 2; // half a day of separation → per-day rate
  }
  return out;
}

// ── Combustion (Astangata) ───────────────────────────────

/**
 * Maximum distance from the Sun, in degrees, at which a planet is considered
 * combust. Values follow the orbs given in Brihat Parashara Hora Shastra; the
 * tighter figure applies when the planet is retrograde, as classical authors
 * treat a retrograde planet as harder to burn.
 */
const COMBUSTION_ORB: Record<string, { direct: number; retro: number }> = {
  Moon: { direct: 12, retro: 12 },
  Mars: { direct: 17, retro: 17 },
  Mercury: { direct: 14, retro: 12 },
  Jupiter: { direct: 11, retro: 11 },
  Venus: { direct: 10, retro: 8 },
  Saturn: { direct: 15, retro: 15 },
};

/** Angular separation between two ecliptic longitudes, 0–180°. */
export function angularSeparation(a: number, b: number): number {
  const d = Math.abs(normalizeDegree(a) - normalizeDegree(b)) % 360;
  return d > 180 ? 360 - d : d;
}

/**
 * Flags planets burnt by proximity to the Sun. Rahu and Ketu are shadow points
 * with no disc to be eclipsed, so they are never combust.
 */
export function detectCombustion(
  siderealLons: Record<string, number>,
  retrogrades: Record<string, boolean> = {}
): Record<string, boolean> {
  const sun = siderealLons.Sun;
  const out: Record<string, boolean> = {};
  for (const body of BODY_ORDER) {
    const orb = COMBUSTION_ORB[body];
    out[body] = orb
      ? angularSeparation(siderealLons[body], sun) <= (retrogrades[body] ? orb.retro : orb.direct)
      : false;
  }
  return out;
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

/**
 * Navamsa sign index (0–11) for any sidereal longitude.
 *
 * Split out so the Ascendant can be mapped into D9 too — without a Navamsa
 * Lagna there is no house structure to draw a D9 chart against.
 */
export function navamsaSignIndexOf(siderealLon: number): number {
  const lon = normalizeDegree(siderealLon);
  const signIdx = Math.floor(lon / 30);
  const navamsaIdx = Math.floor((lon % 30) / (30 / 9)); // 0–8
  const startSign = NAVAMSA_START[RASHI[signIdx].element] ?? 0;
  return (startSign + navamsaIdx) % 12;
}

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
