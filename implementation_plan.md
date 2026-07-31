# Replace Swiss Ephemeris with Pure Astronomical Formulas for Kundali

## Problem

The current kundali generation relies on `swisseph-wasm` (Swiss Ephemeris WebAssembly) for planetary position calculations. The user reports that planets are **coming out wrong** and wants to use **pure mathematical formulas** used by top astrologers — no external astronomy/astrology libraries.

## Approach: VSOP87 & ELP Truncated Series (Same Method Used by Professional Astrologers)

Professional Vedic astrology software (AstroSage, Jagannatha Hora, etc.) ultimately relies on the same underlying astronomy: the **VSOP87** planetary theory for the Sun through Saturn, and the **ELP-2000** theory for the Moon. These are the same theories behind the Swiss Ephemeris, but we'll implement the **truncated series** directly — the top ~20-50 terms for each planet — giving accuracy of **±0.1° to ±0.5°** (well within the ±1° tolerance used in Vedic astrology for sign/house boundaries, and comparable to manual panchang calculations).

### What Changes

1. **Pure formula-based planetary longitude calculator** — implements the key terms of VSOP87 (Sun, Mercury, Venus, Mars, Jupiter, Saturn) and ELP-2000 (Moon), plus analytical lunar node (Rahu/Ketu) computation. No external library needed.

2. **Pure Lahiri Ayanamsa** — well-known polynomial formula (matches the BV Raman / Indian Calendar Reform Committee standard to within a few arcseconds).

3. **Pure Ascendant (Lagna) calculation** — standard spherical astronomy formula using Greenwich Sidereal Time computed from the Julian Day.

4. **Pure retrograde detection** — computed by evaluating planetary longitude at t ± 0.5 day and checking if the speed is negative.

### Accuracy Expectations

| Body | Method | Typical Error |
|---|---|---|
| Sun | VSOP87 truncated (~30 terms) | ±0.01° |
| Moon | ELP-2000 truncated (~60 terms) | ±0.1° |
| Mercury–Saturn | VSOP87 truncated (~20-40 terms per planet) | ±0.1–0.5° |
| Rahu/Ketu | Mean node formula | ±0.5° |
| Ascendant | Standard spherical formula | ±0.1° (time-dependent) |

> [!IMPORTANT]
> These accuracies are **more than sufficient** for Vedic astrology, which works with 30° sign boundaries and 13.33° nakshatra boundaries. The key formulas are the same ones described in Jean Meeus's *Astronomical Algorithms* — the standard reference used by astrology software developers worldwide.

## Proposed Changes

### Core Calculation Engine

#### [MODIFY] [calculations.ts](file:///d:/MERN%20Projects/Astro/src/lib/astrology/calculations.ts)

**Major rewrite** — Remove all `swisseph-wasm` imports and functions (`initSweForVedic`, `julianDayFromSwe`, `readSwePosition`, `swePlanetId`, `planetarySiderealLongitudes` with swe param, `detectRetrogrades` with swe param, `calcAscendantSidereal` with swe param). Replace with:

- `solarLongitude(jd)` — VSOP87 truncated series for Sun's geocentric ecliptic longitude
- `lunarLongitude(jd)` — ELP-2000 truncated series for Moon's geocentric ecliptic longitude
- `planetLongitude(jd, planet)` — VSOP87 truncated series for Mercury, Venus, Mars, Jupiter, Saturn
- `rahuLongitude(jd)` — Mean lunar node formula
- `lahiriAyanamsa(jd)` — Polynomial formula (no swe dependency)
- `calcAscendantSidereal(dateUtc, lat, lon, ayanamsa)` — Pure GST + spherical trig formula (no swe dependency)
- `planetarySiderealLongitudes(dateUtc, ayanamsa)` — Calls the above functions (no swe param)
- `detectRetrogrades(dateUtc)` — Numerical differentiation (no swe param)

All existing function signatures that downstream code uses will be **preserved** (but the `swe` parameter will be removed).

---

### Server Action

#### [MODIFY] [astrology.ts](file:///d:/MERN%20Projects/Astro/src/app/actions/astrology.ts)

- Remove all `swisseph-wasm` import and initialization (`SwissEph`, `swe.initSwissEph()`, `calc.initSweForVedic(swe)`, `swe.close()`)
- Update all function calls to drop the `swe` parameter
- The function signatures simplify from `calc.lahiriAyanamsa(birthUtc, swe)` to `calc.lahiriAyanamsa(birthUtc)`, etc.

---

### Transit Calculations

#### [MODIFY] [transits.ts](file:///d:/MERN%20Projects/Astro/src/lib/astrology/transits.ts)

- Remove `swisseph-wasm` import and initialization in `getTransits()`
- Update calls to use the new parameter-less versions of calculation functions

---

### Dependencies

#### [MODIFY] [package.json](file:///d:/MERN%20Projects/Astro/package.json)

- Remove `"swisseph-wasm": "^0.1.0"` from dependencies (optional — can be done after verification)

## Verification Plan

### Manual Verification
1. Compare the generated planet positions for a known birth chart (e.g., 15 Aug 1947, 00:00, Delhi) against AstroSage or Jagannatha Hora
2. Check that the Ascendant (Lagna), Moon sign, and Nakshatra match for several test cases
3. Verify retrograde detection matches known retrograde periods
4. Run `npm run build` to ensure no TypeScript compilation errors

### Automated Tests
- `npm run build` — TypeScript compilation check
- `npm run dev` — Runtime verification
