"use server";

import * as calc from "@/lib/astrology/calculations";

export async function generateRemediesData(form: any) {
  try {
    const place = form.place;
    const { hour24, minute } = calc.to24Hour(form.hour, form.minute, form.meridiem);
    const birthUtc = calc.zonedBirthToUtc(form.dob, hour24, minute, place.timezone);
    const ayanamsa = calc.lahiriAyanamsa(birthUtc);
    
    const sidereal = calc.planetarySiderealLongitudes(birthUtc, ayanamsa);
    const lagnaSid = calc.calcAscendantSidereal(birthUtc, place.latitude, place.longitude, ayanamsa);
    
    const lagnaInfo = calc.getRashiInfo(lagnaSid);
    const moonInfo = calc.getRashiInfo(sidereal.Moon);
    const nakInfo = calc.getNakshatraInfo(sidereal.Moon);
    const ageYears = calc.getAgeYears(form.dob);

    const dasha = calc.getVimshottariSummary(nakInfo.lord, ageYears);

    const basicRows = calc.buildPlanetRows(sidereal, lagnaInfo.signIndex);
    const weakPlanets = basicRows.filter((r) => [6, 8, 12].includes(r.house)).map((r) => r.body);

    const { generateRemedies } = await import("@/lib/astrology/remedies");
    const remedies = generateRemedies(lagnaInfo, moonInfo, dasha.current, weakPlanets);

    return { 
      success: true, 
      data: { 
        remedies, 
        lagna: `${lagnaInfo.name} (${lagnaInfo.english})`, 
        moon: `${moonInfo.name} (${moonInfo.english})`, 
        dasha: dasha.current 
      } 
    };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message || "Failed to generate remedies" };
  }
}
