"use server";

import * as calc from "@/lib/astrology/calculations";
import * as match from "@/lib/astrology/matching";

export async function generateMatchingData(p1: any, p2: any) {
  try {
    const getBoyGirl = (p1Data: any, p2Data: any) => {
      return p1Data.gender === "male" ? { boy: p1Data, girl: p2Data } : { boy: p2Data, girl: p1Data };
    };
    const { boy, girl } = getBoyGirl(p1, p2);

    const getProfile = (form: any) => {
      const place = form.place!;
      const { hour24, minute } = calc.to24Hour(form.hour, form.minute, form.meridiem);
      const birthUtc = calc.zonedBirthToUtc(form.dob, hour24, minute, place.timezone);
      const ayanamsa = calc.lahiriAyanamsa(birthUtc);
      const sidereal = calc.planetarySiderealLongitudes(birthUtc, ayanamsa);
      const moonRashi = calc.getRashiInfo(sidereal.Moon);
      const lagnaLon = calc.calcAscendantSidereal(birthUtc, place.latitude, place.longitude, ayanamsa);
      const lagnaInfo = calc.getRashiInfo(lagnaLon);
      const marsInfo = calc.getRashiInfo(sidereal.Mars);
      const marsHouse = calc.houseFromPlanet(marsInfo.signIndex, lagnaInfo.signIndex);
      return { moonLon: sidereal.Moon, moonSign: moonRashi.signIndex, marsHouse };
    };

    const boyProf = getProfile(boy);
    const girlProf = getProfile(girl);

    const matchResult = match.calculateAshtakootMatch(
      boyProf.moonLon, girlProf.moonLon, boyProf.moonSign, girlProf.moonSign, boyProf.marsHouse, girlProf.marsHouse
    );

    return { success: true, data: matchResult };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message || "Failed to generate matching" };
  }
}
