"use client";

import { useState, useCallback } from "react";
import { Loader2, Star } from "lucide-react";
import { PlaceAutocomplete } from "@/components/ui/PlaceAutocomplete";
import { KundaliResult } from "./KundaliResult";

interface PlaceData {
  label: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface FormData {
  name: string;
  gender: string;
  dob: string;
  hour: number;
  minute: number;
  meridiem: string;
  placeText: string;
  place: PlaceData | null;
}

export interface PlanetRow {
  body: string;
  lon: number;
  rashi: string;
  rashiEnglish: string;
  house: number;
  signIndex: number;
  nakshatra: string;
  nakshatraPada: number;
  isRetrograde: boolean;
  signDegree: number;
  dignity: string;
}

export interface DoshaSummary {
  manglik: { status: boolean; severity: string; details: string; isCancelled: boolean; cancellationReason: string };
  kaalSarp: { status: boolean; type: string; details: string };
  sadeSati: { status: boolean; phase: string; details: string };
}

export interface YogaSummary {
  name: string;
  formed: boolean;
  planets: string;
  effect: string;
  sanskrit?: string;
  category?: "benefic" | "malefic" | "mixed";
  strength?: "strong" | "moderate" | "weak";
}

export interface KundaliData {
  name: string;
  gender: string;
  dob: string;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
  timezone: string;
  moonSign: { name: string; english: string; degree: number; lord: string };
  sunSign: { name: string; english: string; degree: number; lord: string };
  lagna: { name: string; english: string; lord: string; element: string; degree: number };
  nakshatra: { name: string; lord: string; pada: number; deity: string; gana: string; nadi: string; yoni: string };
  ayanamsa: number;
  dasha: { current: string; currentRange: string; next: string; nextStartsAt: string; remaining: string; antardasha: string };
  planets: PlanetRow[];
  houses: { house: number; sign: string; signEnglish: string; lord: string; planets: string[] }[];
  doshas: DoshaSummary;
  yogas: YogaSummary[];
  navamsa: { planet: string; navamsaSign: string; navamsaEnglish: string; navamsaLord: string; dignity: string }[];
  personality: string;
  career: string;
  marriage: string;
  health: string;
  finance: string;
  spiritual: string;
  positives: string[];
  challenges: { issue: string; solution: string }[];
  remedies: string[];
  luckyGems: { name: string; planet: string; finger: string }[];
  luckyNumbers: number[];
  luckyColors: string[];
  luckyDay: string;
}

export function KundaliForm() {
  const [form, setForm] = useState<FormData>({
    name: "", gender: "male", dob: "", hour: 6, minute: 0, meridiem: "AM",
    placeText: "", place: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<KundaliData | null>(null);

  const update = (key: keyof FormData, val: string | number | PlaceData | null) =>
    setForm((p) => ({ ...p, [key]: val }));

  const generate = useCallback(async () => {
    if (!form.name || !form.dob || !form.place) {
      setError("Please fill all fields and select a city from suggestions.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Dynamic imports for code splitting — heavy libs only load when needed
      const calc = await import("@/lib/astrology/calculations");
      const interp = await import("@/lib/astrology/interpretations");
      const yogaEngine = await import("@/lib/astrology/yogas");
      const Astronomy = await import("astronomy-engine");
      const { NAKSHATRAS, RASHI } = await import("@/lib/astrology/constants");

      const place = form.place!;
      const { hour24, minute } = calc.to24Hour(form.hour, form.minute, form.meridiem);
      const birthUtc = calc.zonedBirthToUtc(form.dob, hour24, minute, place.timezone);
      const ayanamsa = calc.lahiriAyanamsa(birthUtc);
      const sidereal = calc.planetarySiderealLongitudes(birthUtc, ayanamsa, Astronomy);

      const moonInfo = calc.getRashiInfo(sidereal.Moon);
      const sunInfo = calc.getRashiInfo(sidereal.Sun);
      const nakInfo = calc.getNakshatraInfo(sidereal.Moon);
      const lagnaSid = calc.calcAscendantSidereal(birthUtc, place.latitude, place.longitude, ayanamsa, Astronomy);
      const lagnaInfo = calc.getRashiInfo(lagnaSid);
      const ageYears = calc.getAgeYears(form.dob);

      // ── Detailed Vimshottari Dasha (proper antardasha) ──
      const detailedDasha = calc.getDetailedVimshottari(nakInfo.lord, ageYears);
      const dasha = {
        current: detailedDasha.mahaLord,
        currentRange: detailedDasha.mahaRange,
        next: detailedDasha.nextMahaLord,
        nextStartsAt: detailedDasha.nextMahaStartAge,
        remaining: detailedDasha.mahaRemaining,
        antardasha: detailedDasha.antarLord,
      };

      // ── Planet rows with full dignity + retrograde ──
      const basicRows = calc.buildPlanetRows(sidereal, lagnaInfo.signIndex);
      const retrogrades = calc.detectRetrogrades(birthUtc, Astronomy);
      const planets: PlanetRow[] = basicRows.map((r) => {
        const nak = calc.getNakshatraInfo(sidereal[r.body]);
        const rashiInfo = calc.getRashiInfo(sidereal[r.body]);
        return {
          ...r,
          nakshatra: nak.name,
          nakshatraPada: nak.pada,
          isRetrograde: retrogrades[r.body] ?? false,
          signDegree: rashiInfo.signDegree,
          dignity: calc.getPlanetDignity(r.body, rashiInfo.english),
        };
      });

      // ── Houses ──
      const housesArr = Array.from({ length: 12 }, (_, i) => {
        const sIdx = (lagnaInfo.signIndex + i) % 12;
        const sign = RASHI[sIdx];
        const planetsInHouse = planets.filter((p) => p.house === i + 1).map((p) => p.body);
        return { house: i + 1, sign: sign.name, signEnglish: sign.english, lord: sign.lord, planets: planetsInHouse };
      });

      // ── PlanetMap for yoga engine ──
      type PlanetMap = Record<string, { house: number; signIndex: number; isRetrograde: boolean; dignity: string }>;
      const planetMap: PlanetMap = {};
      for (const p of planets) {
        planetMap[p.body] = { house: p.house, signIndex: p.signIndex, isRetrograde: p.isRetrograde, dignity: p.dignity };
      }

      // ── HouseMap for yoga engine ──
      type HouseMap = Record<number, { lord: string; signIndex: number; planets: string[] }>;
      const houseMap: HouseMap = {};
      for (const h of housesArr) {
        houseMap[h.house] = { lord: h.lord, signIndex: (lagnaInfo.signIndex + h.house - 1) % 12, planets: h.planets };
      }

      // ── All 23 yogas with full analysis ──
      const allYogasRaw = yogaEngine.detectAllYogas(planetMap, houseMap);
      const yogas: YogaSummary[] = allYogasRaw.map((y) => ({
        name: y.name,
        formed: y.formed,
        planets: y.planets,
        effect: y.effect,
        sanskrit: y.sanskrit,
        category: y.category,
        strength: y.strength,
      }));

      // ── Enhanced Manglik analysis with cancellation ──
      const manglikResult = yogaEngine.analyzeManglik(planetMap, houseMap);
      // ── Kaal Sarp with type detection ──
      const kaalSarpResult = yogaEngine.analyzeKaalSarp(planetMap);

      // ── Sade Sati ──
      const moonIdx = moonInfo.signIndex;
      const satIdx = planets.find((p) => p.body === "Saturn")?.signIndex ?? 0;
      const satFromMoon = (satIdx - moonIdx + 12) % 12;
      const isSadeSati = [0, 1, 11].includes(satFromMoon);
      const sadeSatiPhase = satFromMoon === 11 ? "Rising (1st phase)" : satFromMoon === 0 ? "Peak (2nd phase)" : satFromMoon === 1 ? "Setting (3rd phase)" : "Not active";
      const rahuH = planets.find((p) => p.body === "Rahu")?.house ?? 0;
      const ketuH = planets.find((p) => p.body === "Ketu")?.house ?? 0;

      const doshas: DoshaSummary = {
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

      // ── Navamsa (D9) chart ──
      const navamsaRaw = calc.calcNavamsa(sidereal);
      const navamsa = navamsaRaw.map((n) => ({
        planet: n.planet,
        navamsaSign: n.navamsaSign,
        navamsaEnglish: n.navamsaEnglish,
        navamsaLord: n.navamsaLord,
        dignity: n.dignity,
      }));

      // ── Nakshatra details ──
      const NAK_DEITIES = ["Ashwini Kumaras","Yama","Agni","Brahma","Soma","Rudra","Aditi","Brihaspati","Nagas","Pitrs","Bhaga","Aryaman","Savitar","Tvashtar","Vayu","Indragni","Mitra","Indra","Nirriti","Apas","Vishvedeva","Vishnu","Vasu","Varuna","Ajaikapada","Ahirbudhnya","Pushan"];
      const NAK_GANAS = ["Deva","Manushya","Rakshasa","Deva","Deva","Manushya","Deva","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva","Rakshasa","Deva","Rakshasa","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva","Rakshasa","Rakshasa","Manushya","Deva","Deva"];
      const NAK_NADIS = ["Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya"];
      const NAK_YONIS = ["Horse","Elephant","Sheep","Serpent","Serpent","Dog","Cat","Ram","Cat","Rat","Rat","Cow","Buffalo","Tiger","Buffalo","Tiger","Deer","Deer","Dog","Monkey","Mongoose","Monkey","Lion","Horse","Lion","Cow","Elephant"];

      // ── Chart-specific predictions (new engine) ──
      const personality = interp.describeTemperament(lagnaInfo, moonInfo, nakInfo, planets);
      const career = interp.predictCareer(lagnaInfo, planets, housesArr);
      const finance = interp.predictFinance(planets, housesArr);
      const health = interp.predictHealth(lagnaInfo, planets, housesArr);
      const spiritual = interp.predictSpiritual(planets, housesArr);
      const marriage = interp.predictMarriage(ageYears, planets, housesArr, navamsa);

      const analysis = interp.getPositivesAndChallenges(lagnaInfo, moonInfo, planets, housesArr);
      const remedyList = interp.buildRemedies(lagnaInfo, nakInfo.name, { current: dasha.current, currentRange: dasha.currentRange, next: dasha.next, nextStartsAt: dasha.nextStartsAt }, planets);

      // ── Lucky gems (Lagna lord + Moon lord + Dasha lord) ──
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

      // ── Lucky numbers from Lagna + Moon + Nakshatra ──
      const lagnaNum = lagnaInfo.signIndex + 1;
      const moonNum = (moonInfo.signIndex % 9) + 1;
      const nakNum = (nakInfo.index % 9) + 1;
      const luckyNumbers = [...new Set([lagnaNum, moonNum, nakNum])];

      // ── Lucky colors from Lagna element ──
      const colorMap: Record<string, string[]> = {
        Fire: ["Red", "Orange", "Gold", "Copper"],
        Earth: ["Green", "Brown", "White", "Cream"],
        Air: ["Blue", "Light Green", "Purple", "Sky Blue"],
        Water: ["Silver", "White", "Sea Green", "Pale Blue"],
      };

      setResult({
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
        planets, houses: housesArr, doshas, yogas, navamsa,
        personality, career, marriage, health, finance, spiritual,
        positives: analysis.positives,
        challenges: analysis.challenges,
        remedies: remedyList,
        luckyGems,
        luckyNumbers,
        luckyColors: colorMap[lagnaInfo.element] || ["Gold", "White", "Blue"],
        luckyDay: ({ Sun: "Sunday", Moon: "Monday", Mars: "Tuesday", Mercury: "Wednesday", Jupiter: "Thursday", Venus: "Friday", Saturn: "Saturday" } as Record<string, string>)[lagnaInfo.lord] || "Monday",
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate Kundali. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  }, [form]);

  return (
    <>
      <div className="glass-card p-6 sm:p-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Full Name" value={form.name} onChange={(v) => update("name", v)} placeholder="Enter your full name" />
          <SelectField label="Gender" value={form.gender} onChange={(v) => update("gender", v)}
            options={[{ v: "male", l: "Male" }, { v: "female", l: "Female" }, { v: "other", l: "Other" }]} />
          <InputField label="Date of Birth" type="date" value={form.dob} onChange={(v) => update("dob", v)} />
          <div>
            <label className="block text-xs text-gold-200 uppercase tracking-wider mb-2">Time of Birth</label>
            <div className="grid grid-cols-3 gap-2">
              <select value={form.hour} onChange={(e) => update("hour", +e.target.value)} className="form-select">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>{String(h).padStart(2, "0")}</option>
                ))}
              </select>
              <select value={form.minute} onChange={(e) => update("minute", +e.target.value)} className="form-select">
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
                ))}
              </select>
              <select value={form.meridiem} onChange={(e) => update("meridiem", e.target.value)} className="form-select">
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-gold-200 uppercase tracking-wider mb-2">Place of Birth</label>
            <PlaceAutocomplete
              value={form.placeText}
              onChange={(v) => { update("placeText", v); update("place", null); }}
              onSelect={(p) => { update("placeText", p.label); update("place", p); }}
              placeholder="Search city, state, country..."
            />
            {form.place && (
              <div className="text-xs text-mystic-green mt-1">
                ✓ {form.place.label} ({form.place.latitude.toFixed(2)}°N, {form.place.longitude.toFixed(2)}°E, TZ: {form.place.timezone})
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        <button onClick={generate} disabled={loading}
          className="gold-btn w-full mt-6 py-4 text-lg rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" />}
          {loading ? "Calculating your Kundali..." : "Generate Free Kundali"}
        </button>
      </div>

      {result && <KundaliResult data={result} />}
    </>
  );
}

// ── Form sub-components ───────────────────────────────────

function InputField({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gold-200 uppercase tracking-wider mb-2">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="form-select w-full" />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[];
}) {
  return (
    <div>
      <label className="block text-xs text-gold-200 uppercase tracking-wider mb-2">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="form-select w-full">
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}
