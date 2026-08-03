/* Verifies the astronomy engine against independently-known sky events. */
import {
  julianDay,
  getSunTropicalLongitude,
  getMoonTropicalLongitude,
  getRahuTropicalLongitude,
  getRahuMeanTropicalLongitude,
  lahiriAyanamsa,
  planetarySiderealLongitudes,
} from "../src/lib/astrology/calculations";

function T(dateUtc: Date) {
  return (julianDay(dateUtc) - 2451545.0) / 36525.0;
}

function sep(a: number, b: number) {
  let d = ((a - b) % 360 + 540) % 360 - 180;
  return d;
}

const results: string[] = [];
function check(label: string, actual: number, expected: number, tolDeg: number) {
  const err = sep(actual, expected);
  const ok = Math.abs(err) <= tolDeg;
  results.push(
    `${ok ? "PASS" : "FAIL"}  ${label.padEnd(46)} got ${actual.toFixed(4)}°  want ${expected.toFixed(4)}°  err ${(err * 60).toFixed(2)}'  tol ${(tolDeg * 60).toFixed(1)}'`
  );
}

// ── Equinoxes & solstices: Sun's tropical longitude is exactly 0/90/180/270 ──
check("Sun @ Mar equinox 2000-03-20 07:35Z", getSunTropicalLongitude(T(new Date("2000-03-20T07:35:00Z"))), 0, 0.02);
check("Sun @ Jun solstice 2000-06-21 01:48Z", getSunTropicalLongitude(T(new Date("2000-06-21T01:48:00Z"))), 90, 0.02);
check("Sun @ Sep equinox 2000-09-22 17:28Z", getSunTropicalLongitude(T(new Date("2000-09-22T17:28:00Z"))), 180, 0.02);
check("Sun @ Dec solstice 2000-12-21 13:38Z", getSunTropicalLongitude(T(new Date("2000-12-21T13:38:00Z"))), 270, 0.02);
check("Sun @ Mar equinox 2026-03-20 14:46Z", getSunTropicalLongitude(T(new Date("2026-03-20T14:46:00Z"))), 0, 0.02);

// ── Syzygies: at New Moon the Moon and Sun share a longitude; at Full Moon
//    they are 180° apart. Eclipse timings are the most precisely known. ──
function syzygy(label: string, iso: string, offset: number, tol: number) {
  const t = T(new Date(iso));
  check(label, getMoonTropicalLongitude(t), getSunTropicalLongitude(t) + offset, tol);
}
syzygy("New Moon 2000-01-06 18:14Z", "2000-01-06T18:14:00Z", 0, 0.03);
syzygy("Full Moon (lunar ecl) 2000-01-21 04:41Z", "2000-01-21T04:41:00Z", 180, 0.03);
syzygy("New Moon 1999-08-11 11:09Z", "1999-08-11T11:09:00Z", 0, 0.03);
syzygy("New Moon 2017-08-21 18:30Z", "2017-08-21T18:30:00Z", 0, 0.03);
syzygy("Full Moon 2018-07-27 20:20Z", "2018-07-27T20:20:00Z", 180, 0.03);
syzygy("New Moon 2024-04-08 18:21Z", "2024-04-08T18:21:00Z", 0, 0.03);
syzygy("New Moon 2026-01-18 19:52Z", "2026-01-18T19:52:00Z", 0, 0.03);

// ── Eclipses also pin the lunar node: the Moon must be near a node, so the
//    node's longitude must be within a few degrees of the Sun's (or Sun+180). ──
{
  const t = T(new Date("2024-04-08T18:18:00Z"));
  const node = getRahuTropicalLongitude(t);
  const sun = getSunTropicalLongitude(t);
  const d = Math.min(Math.abs(sep(node, sun)), Math.abs(sep(node, sun + 180)));
  // A central solar eclipse requires the Moon within ~4.6° of a node.
  results.push(`${d < 4.6 ? "PASS" : "FAIL"}  ${"Node within eclipse limit 2024-04-08".padEnd(46)} offset ${d.toFixed(3)}°  tol 4.6°`);
  // The true node oscillates about the mean node by at most ~1.6°.
  const t2 = T(new Date("2000-01-01T12:00:00Z"));
  check("Mean node @ J2000", getRahuMeanTropicalLongitude(t2), 125.0445, 0.001);
  let maxSwing = 0;
  for (let k = 0; k < 400; k++) {
    const tt = T(new Date(Date.UTC(2020, 0, 1) + k * 86400000));
    maxSwing = Math.max(maxSwing, Math.abs(sep(getRahuTropicalLongitude(tt), getRahuMeanTropicalLongitude(tt))));
  }
  results.push(`${maxSwing > 1.0 && maxSwing < 2.0 ? "PASS" : "FAIL"}  ${"True-vs-mean node swing over 400d".padEnd(46)} max ${maxSwing.toFixed(3)}°  want 1.0-2.0°`);
}

// ── Lahiri ayanamsa: defined as 23°51'11.27" at J2000.0 ──
check("Lahiri ayanamsa @ J2000", lahiriAyanamsa(new Date("2000-01-01T12:00:00Z")), 23.853130, 0.001);

// ── Sidereal positions for a documented chart: 1947-08-15 00:00 IST, Delhi ──
{
  const birth = new Date("1947-08-14T18:30:00Z");
  const ayan = lahiriAyanamsa(birth);
  const p = planetarySiderealLongitudes(birth, ayan);
  results.push("");
  results.push(`India independence chart — 1947-08-15 00:00 IST (ayanamsa ${ayan.toFixed(4)}°)`);
  const SIGNS = ["Ari","Tau","Gem","Can","Leo","Vir","Lib","Sco","Sag","Cap","Aqu","Pis"];
  for (const body of ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"]) {
    const lon = p[body];
    const s = Math.floor(lon / 30);
    results.push(`   ${body.padEnd(8)} ${lon.toFixed(3).padStart(8)}°  =  ${SIGNS[s]} ${(lon % 30).toFixed(2)}°`);
  }
}

console.log(results.join("\n"));
const failed = results.filter((r) => r.startsWith("FAIL")).length;
console.log(`\n${failed === 0 ? "ALL CHECKS PASSED" : failed + " CHECK(S) FAILED"}`);
