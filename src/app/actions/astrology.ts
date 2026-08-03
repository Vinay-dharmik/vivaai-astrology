"use server";

import * as calc from "@/lib/astrology/calculations";
import * as interp from "@/lib/astrology/interpretations";
import * as yogaEngine from "@/lib/astrology/yogas";
import { computeShadbala, declinationOf, aspectStrength, SHADBALA_PLANETS } from "@/lib/astrology/shadbala";
import { computeAshtakavarga } from "@/lib/astrology/ashtakavarga";
import { buildPlanetReport } from "@/lib/astrology/planetReport";
import { NAKSHATRAS, RASHI } from "@/lib/astrology/constants";
import { PlanetRow, DoshaSummary, YogaSummary } from "@/components/kundali/KundaliForm";

export async function generateKundaliData(form: any) {
  try {
    const place = form.place;
    const { hour24, minute } = calc.to24Hour(form.hour, form.minute, form.meridiem);
    const birthUtc = calc.zonedBirthToUtc(form.dob, hour24, minute, place.timezone);
    const ayanamsa = calc.lahiriAyanamsa(birthUtc);
    const sidereal = calc.planetarySiderealLongitudes(birthUtc, ayanamsa);

    const moonInfo = calc.getRashiInfo(sidereal.Moon);
    const sunInfo = calc.getRashiInfo(sidereal.Sun);
    const nakInfo = calc.getNakshatraInfo(sidereal.Moon);
    const lagnaSid = calc.calcAscendantSidereal(birthUtc, place.latitude, place.longitude, ayanamsa);
    const lagnaInfo = calc.getRashiInfo(lagnaSid);
    const ageYears = calc.getAgeYears(form.dob);

    const detailedDasha = calc.getDetailedVimshottari(nakInfo.lord, ageYears);
    const dasha = {
      current: detailedDasha.mahaLord,
      currentRange: detailedDasha.mahaRange,
      next: detailedDasha.nextMahaLord,
      nextStartsAt: detailedDasha.nextMahaStartAge,
      remaining: detailedDasha.mahaRemaining,
      antardasha: detailedDasha.antarLord,
    };

    const basicRows = calc.buildPlanetRows(sidereal, lagnaInfo.signIndex);
    const retrogrades = calc.detectRetrogrades(birthUtc);
    const combust = calc.detectCombustion(sidereal, retrogrades);
    const planets: any[] = basicRows.map((r) => {
      const nak = calc.getNakshatraInfo(sidereal[r.body]);
      const rashiInfo = calc.getRashiInfo(sidereal[r.body]);
      return {
        ...r,
        nakshatra: nak.name,
        nakshatraPada: nak.pada,
        isRetrograde: retrogrades[r.body] ?? false,
        isCombust: combust[r.body] ?? false,
        signDegree: rashiInfo.signDegree,
        dignity: calc.getPlanetDignity(r.body, rashiInfo.english),
      };
    });

    const housesArr = Array.from({ length: 12 }, (_, i) => {
      const sIdx = (lagnaInfo.signIndex + i) % 12;
      const sign = RASHI[sIdx];
      const planetsInHouse = planets.filter((p) => p.house === i + 1).map((p) => p.body);
      return { house: i + 1, sign: sign.name, signEnglish: sign.english, lord: sign.lord, planets: planetsInHouse };
    });

    type PlanetMap = Record<string, { house: number; signIndex: number; isRetrograde: boolean; dignity: string }>;
    const planetMap: PlanetMap = {};
    for (const p of planets) {
      planetMap[p.body] = { house: p.house, signIndex: p.signIndex, isRetrograde: p.isRetrograde, dignity: p.dignity };
    }

    type HouseMap = Record<number, { lord: string; signIndex: number; planets: string[] }>;
    const houseMap: HouseMap = {};
    for (const h of housesArr) {
      houseMap[h.house] = { lord: h.lord, signIndex: (lagnaInfo.signIndex + h.house - 1) % 12, planets: h.planets };
    }

    const allYogasRaw = yogaEngine.detectAllYogas(planetMap, houseMap);
    const yogas = allYogasRaw.map((y) => ({
      name: y.name,
      formed: y.formed,
      planets: y.planets,
      effect: y.effect,
      sanskrit: y.sanskrit,
      category: y.category,
      strength: y.strength,
    }));

    const manglikResult = yogaEngine.analyzeManglik(planetMap, houseMap);
    const kaalSarpResult = yogaEngine.analyzeKaalSarp(planetMap);

    const moonIdx = moonInfo.signIndex;
    const satIdx = planets.find((p) => p.body === "Saturn")?.signIndex ?? 0;
    const satFromMoon = (satIdx - moonIdx + 12) % 12;
    const isSadeSati = [0, 1, 11].includes(satFromMoon);
    const sadeSatiPhase = satFromMoon === 11 ? "Rising (1st phase)" : satFromMoon === 0 ? "Peak (2nd phase)" : satFromMoon === 1 ? "Setting (3rd phase)" : "Not active";
    const rahuH = planets.find((p) => p.body === "Rahu")?.house ?? 0;
    const ketuH = planets.find((p) => p.body === "Ketu")?.house ?? 0;

    const doshas = {
      manglik: {
        status: manglikResult.isManglik,
        severity: manglikResult.severity,
        details: manglikResult.details,
        isCancelled: manglikResult.isCancelled,
        cancellationReason: manglikResult.cancellationReason,
      },
      kaalSarp: {
        status: kaalSarpResult.isPresent,
        type: kaalSarpResult.type || (kaalSarpResult.isPresent ? `Rahu in ${rahuH}th, Ketu in ${ketuH}th house` : ""),
        details: kaalSarpResult.details,
      },
      sadeSati: {
        status: isSadeSati,
        phase: sadeSatiPhase,
        details: isSadeSati
          ? `Saturn transiting near Moon sign. Phase: ${sadeSatiPhase}. Patience and discipline are essential. Duration: typically 2.5 years per phase.`
          : "Sade Sati not active. Saturn's influence on Moon sign is currently normal.",
      },
    };

    const navamsaRaw = calc.calcNavamsa(sidereal);
    const navamsa = navamsaRaw.map((n) => ({
      planet: n.planet,
      // Carried through so the D9 chart can actually be drawn — without the
      // index there is only a sign name and nothing to place a planet against.
      navamsaSignIndex: n.navamsaSignIndex,
      navamsaSign: n.navamsaSign,
      navamsaEnglish: n.navamsaEnglish,
      navamsaLord: n.navamsaLord,
      dignity: n.dignity,
    }));
    /** D9 rises from the Navamsa of the Ascendant degree, not of its sign. */
    const navamsaLagnaSignIndex = calc.navamsaSignIndexOf(lagnaSid);

    // ── Six-fold strength, Ashtakavarga, and the per-planet write-up ──

    const speeds = calc.planetaryDailySpeeds(birthUtc);
    const localHour = hour24 + minute / 60;
    // Declination needs the tropical longitude, so the ayanamsa goes back on.
    const declinations: Record<string, number> = {};
    for (const body of Object.keys(sidereal)) {
      declinations[body] = declinationOf(sidereal[body] + ayanamsa);
    }

    const houseOf: Record<string, number> = {};
    for (const p of planets) houseOf[p.body] = p.house;

    const shadbala = computeShadbala({
      longitudes: sidereal,
      speeds,
      houses: houseOf,
      ascendantLon: lagnaSid,
      birthUtc,
      localHour,
      isDayBirth: localHour >= 6 && localHour < 18,
      sunDeclination: declinations.Sun,
      declinations,
    });

    const avSignIndex: Record<string, number> = { Lagna: lagnaInfo.signIndex };
    for (const p of planets) avSignIndex[p.body] = p.signIndex;
    const ashtakavarga = computeAshtakavarga(avSignIndex);

    const strengthOf = new Map(shadbala.map((s) => [s.planet as string, s]));
    const bhinnaOf = new Map(ashtakavarga.bhinna.map((b) => [b.planet as string, b]));

    const planetReports = planets.map((p) => {
      // Which planets throw a meaningful aspect at this one.
      const aspectedBy = SHADBALA_PLANETS.filter(
        (other) => other !== p.body && aspectStrength(other, sidereal[other], sidereal[p.body]) > 20
      );

      return buildPlanetReport({
        planet: p.body,
        lagnaSignIndex: lagnaInfo.signIndex,
        signIndex: p.signIndex,
        signDegree: p.signDegree,
        house: p.house,
        dignity: p.dignity,
        isRetrograde: p.isRetrograde,
        isCombust: p.isCombust,
        nakshatra: p.nakshatra,
        nakshatraPada: p.nakshatraPada,
        strength: strengthOf.get(p.body),
        ownBindus: bhinnaOf.get(p.body)?.bindusBySign[p.signIndex],
        sarvaBindus: ashtakavarga.sarvaBySign[p.signIndex],
        aspectedBy: [...aspectedBy],
        currentDashaLord: dasha.current,
      });
    });

    const NAK_DEITIES = ["Ashwini Kumaras","Yama","Agni","Brahma","Soma","Rudra","Aditi","Brihaspati","Nagas","Pitrs","Bhaga","Aryaman","Savitar","Tvashtar","Vayu","Indragni","Mitra","Indra","Nirriti","Apas","Vishvedeva","Vishnu","Vasu","Varuna","Ajaikapada","Ahirbudhnya","Pushan"];
    const NAK_GANAS = ["Deva","Manushya","Rakshasa","Deva","Deva","Manushya","Deva","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva","Rakshasa","Deva","Rakshasa","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva","Rakshasa","Rakshasa","Manushya","Deva","Deva"];
    const NAK_NADIS = ["Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya"];
    const NAK_YONIS = ["Horse","Elephant","Sheep","Serpent","Serpent","Dog","Cat","Ram","Cat","Rat","Rat","Cow","Buffalo","Tiger","Buffalo","Tiger","Deer","Deer","Dog","Monkey","Mongoose","Monkey","Lion","Horse","Lion","Cow","Elephant"];

    const personality = interp.describeTemperament(lagnaInfo, moonInfo, nakInfo, planets);
    const career = interp.predictCareer(lagnaInfo, planets, housesArr);
    const finance = interp.predictFinance(planets, housesArr);
    const health = interp.predictHealth(lagnaInfo, planets, housesArr);
    const spiritual = interp.predictSpiritual(planets, housesArr);
    const marriage = interp.predictMarriage(ageYears, planets, housesArr, navamsa);

    const analysis = interp.getPositivesAndChallenges(lagnaInfo, moonInfo, planets, housesArr);
    const remedyList = interp.buildRemedies(lagnaInfo, nakInfo.name, { current: dasha.current, currentRange: dasha.currentRange, next: dasha.next, nextStartsAt: dasha.nextStartsAt }, planets);

    const gemMap: Record<string, { name: string; finger: string }> = {
      Sun: { name: "Ruby (Manik)", finger: "Ring finger, Sunday morning" },
      Moon: { name: "Pearl (Moti)", finger: "Little finger, Monday morning" },
      Mars: { name: "Red Coral (Moonga)", finger: "Ring finger, Tuesday morning" },
      Mercury: { name: "Emerald (Panna)", finger: "Little finger, Wednesday morning" },
      Jupiter: { name: "Yellow Sapphire (Pukhraj)", finger: "Index finger, Thursday morning" },
      Venus: { name: "Diamond (Heera) / White Sapphire", finger: "Middle finger, Friday morning" },
      Saturn: { name: "Blue Sapphire (Neelam)", finger: "Middle finger, Saturday morning" },
      Rahu: { name: "Hessonite (Gomed)", finger: "Middle finger, Saturday" },
      Ketu: { name: "Cat's Eye (Lahsunia)", finger: "Little finger, Thursday" },
    };
    const gemPlanets = [...new Set([lagnaInfo.lord, moonInfo.lord, dasha.current])].filter((p) => gemMap[p]);
    const luckyGems = gemPlanets.map((p) => ({ ...(gemMap[p] || { name: "Consult astrologer", finger: "-" }), planet: p }));

    const lagnaNum = lagnaInfo.signIndex + 1;
    const moonNum = (moonInfo.signIndex % 9) + 1;
    const nakNum = (nakInfo.index % 9) + 1;
    const luckyNumbers = [...new Set([lagnaNum, moonNum, nakNum])];

    const colorMap: Record<string, string[]> = {
      Fire: ["Red", "Orange", "Gold", "Copper"],
      Earth: ["Green", "Brown", "White", "Cream"],
      Air: ["Blue", "Light Green", "Purple", "Sky Blue"],
      Water: ["Silver", "White", "Sea Green", "Pale Blue"],
    };

    return {
      success: true,
      data: {
        name: form.name, gender: form.gender, dob: form.dob,
        time: `${String(form.hour).padStart(2, "0")}:${String(form.minute).padStart(2, "0")} ${form.meridiem}`,
        place: place.label, latitude: place.latitude, longitude: place.longitude, timezone: place.timezone,
        moonSign: { name: moonInfo.name, english: moonInfo.english, degree: moonInfo.signDegree, lord: moonInfo.lord },
        sunSign: { name: sunInfo.name, english: sunInfo.english, degree: sunInfo.signDegree, lord: sunInfo.lord },
        lagna: { name: lagnaInfo.name, english: lagnaInfo.english, lord: lagnaInfo.lord, element: lagnaInfo.element, degree: lagnaInfo.signDegree },
        nakshatra: {
          name: nakInfo.name, lord: nakInfo.lord, pada: nakInfo.pada,
          deity: NAK_DEITIES[nakInfo.index] || "-",
          gana: NAK_GANAS[nakInfo.index] || "-",
          nadi: NAK_NADIS[nakInfo.index] || "-",
          yoni: NAK_YONIS[nakInfo.index] || "-",
        },
        ayanamsa, dasha,
        planets, houses: housesArr, doshas, yogas, navamsa, navamsaLagnaSignIndex,
        lagnaSignIndex: lagnaInfo.signIndex,
        moonSignIndex: moonInfo.signIndex,
        shadbala, ashtakavarga, planetReports,
        personality, career, marriage, health, finance, spiritual,
        positives: analysis.positives,
        challenges: analysis.challenges,
        remedies: remedyList,
        luckyGems,
        luckyNumbers,
        luckyColors: colorMap[lagnaInfo.element] || ["Gold", "White", "Blue"],
        luckyDay: ({ Sun: "Sunday", Moon: "Monday", Mars: "Tuesday", Mercury: "Wednesday", Jupiter: "Thursday", Venus: "Friday", Saturn: "Saturday" } as Record<string, string>)[lagnaInfo.lord] || "Monday",
      }
    };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message || "Failed to generate Kundali" };
  }
}
