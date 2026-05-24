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
  manglik: { status: boolean; severity: string; details: string };
  kaalSarp: { status: boolean; type: string; details: string };
  sadeSati: { status: boolean; phase: string; details: string };
}

export interface YogaSummary {
  name: string;
  formed: boolean;
  planets: string;
  effect: string;
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
      const calc = await import("@/lib/astrology/calculations");
      const interp = await import("@/lib/astrology/interpretations");
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
      const dasha = calc.getVimshottariSummary(nakInfo.lord, ageYears);

      // Build detailed planet rows
      const basicRows = calc.buildPlanetRows(sidereal, lagnaInfo.signIndex);
      const planets: PlanetRow[] = basicRows.map((r) => {
        const nak = calc.getNakshatraInfo(sidereal[r.body]);
        const rashiInfo = calc.getRashiInfo(sidereal[r.body]);
        return {
          ...r,
          nakshatra: nak.name,
          nakshatraPada: nak.pada,
          isRetrograde: false, // simplified
          signDegree: rashiInfo.signDegree,
          dignity: getDignity(r.body, rashiInfo.english),
        };
      });

      // Build houses
      const houses = Array.from({ length: 12 }, (_, i) => {
        const sIdx = (lagnaInfo.signIndex + i) % 12;
        const sign = RASHI[sIdx];
        const planetsInHouse = planets.filter((p) => p.house === i + 1).map((p) => p.body);
        return { house: i + 1, sign: sign.name, signEnglish: sign.english, lord: sign.lord, planets: planetsInHouse };
      });

      // Doshas
      const marsHouse = planets.find((p) => p.body === "Mars")?.house ?? 0;
      const satHouse = planets.find((p) => p.body === "Saturn")?.house ?? 0;
      const rahuHouse = planets.find((p) => p.body === "Rahu")?.house ?? 0;
      const ketuHouse = planets.find((p) => p.body === "Ketu")?.house ?? 0;

      const manglikHouses = [1, 2, 4, 7, 8, 12];
      const isManglik = manglikHouses.includes(marsHouse);
      const manglikSeverity = [1, 7, 8].includes(marsHouse) ? "High" : isManglik ? "Moderate" : "None";

      // Kaal Sarp: all planets between Rahu-Ketu axis
      const rahuIdx = planets.find((p) => p.body === "Rahu")?.signIndex ?? 0;
      const ketuIdx = planets.find((p) => p.body === "Ketu")?.signIndex ?? 0;
      const otherPlanets = planets.filter((p) => p.body !== "Rahu" && p.body !== "Ketu");
      const allBetween = otherPlanets.every((p) => {
        const d = (p.signIndex - rahuIdx + 12) % 12;
        const span = (ketuIdx - rahuIdx + 12) % 12;
        return d <= span;
      });
      const isKaalSarp = allBetween && rahuIdx !== ketuIdx;

      // Sade Sati: Saturn in 12th, 1st, or 2nd from Moon sign
      const moonIdx = moonInfo.signIndex;
      const satIdx = planets.find((p) => p.body === "Saturn")?.signIndex ?? 0;
      const satFromMoon = ((satIdx - moonIdx + 12) % 12);
      const isSadeSati = [0, 1, 11].includes(satFromMoon);
      const sadeSatiPhase = satFromMoon === 11 ? "Rising (1st phase)" : satFromMoon === 0 ? "Peak (2nd phase)" : satFromMoon === 1 ? "Setting (3rd phase)" : "Not active";

      const doshas: DoshaSummary = {
        manglik: { status: isManglik, severity: manglikSeverity, details: isManglik ? `Mars in ${marsHouse}th house creates Manglik Dosha. ${manglikSeverity} severity.` : "No Manglik Dosha. Mars is well-placed for relationships." },
        kaalSarp: { status: isKaalSarp, type: isKaalSarp ? `Rahu in ${rahuHouse}th, Ketu in ${ketuHouse}th house` : "", details: isKaalSarp ? "All planets confined between Rahu-Ketu axis. May cause delays and karmic lessons." : "No Kaal Sarp Dosha. Planetary spread is balanced." },
        sadeSati: { status: isSadeSati, phase: sadeSatiPhase, details: isSadeSati ? `Saturn transiting near Moon sign. Phase: ${sadeSatiPhase}. Patience and discipline needed.` : "Sade Sati not active currently. Saturn's influence is normal." },
      };

      // Yogas
      const yogas: YogaSummary[] = [];
      const jupH = planets.find((p) => p.body === "Jupiter")?.house ?? 0;
      const venH = planets.find((p) => p.body === "Venus")?.house ?? 0;
      const sunH = planets.find((p) => p.body === "Sun")?.house ?? 0;
      const merH = planets.find((p) => p.body === "Mercury")?.house ?? 0;

      // Gajakesari Yoga
      const jupFromMoon = ((jupH - (planets.find((p) => p.body === "Moon")?.house ?? 1) + 12) % 12) + 1;
      if ([1, 4, 7, 10].includes(jupFromMoon)) {
        yogas.push({ name: "Gajakesari Yoga", formed: true, planets: "Jupiter + Moon", effect: "Intelligence, fame, prosperity. Native earns respect and holds good position." });
      }
      // Budha-Aditya Yoga
      if (sunH === merH) {
        yogas.push({ name: "Budhaditya Yoga", formed: true, planets: "Sun + Mercury", effect: "Sharp intellect, good speech, success in education and communication." });
      }
      // Lakshmi Yoga
      if ([1, 5, 9].includes(venH) && [1, 4, 7, 10].includes(jupH)) {
        yogas.push({ name: "Lakshmi Yoga", formed: true, planets: "Venus + Jupiter", effect: "Wealth, luxury, happy married life. Native enjoys material comforts." });
      }
      // Raja Yoga (simplified)
      const kendras = [1, 4, 7, 10];
      const trikonas = [1, 5, 9];
      const kendraLords = kendras.map((h) => houses[h - 1].lord);
      const trikonaLords = trikonas.map((h) => houses[h - 1].lord);
      const commonLords = kendraLords.filter((l) => trikonaLords.includes(l));
      if (commonLords.length > 0) {
        yogas.push({ name: "Raja Yoga", formed: true, planets: commonLords.join(", "), effect: "Power, authority, success in profession. Native rises to high position." });
      }

      if (yogas.length === 0) {
        yogas.push({ name: "No major yoga", formed: false, planets: "-", effect: "Standard planetary placement. Success comes through persistent effort." });
      }

      // Nakshatra details
      const NAK_DEITIES = ["Ashwini Kumaras","Yama","Agni","Brahma","Soma","Rudra","Aditi","Brihaspati","Nagas","Pitrs","Bhaga","Aryaman","Savitar","Tvashtar","Vayu","Indragni","Mitra","Indra","Nirriti","Apas","Vishvedeva","Vishnu","Vasu","Varuna","Ajaikapada","Ahirbudhnya","Pushan"];
      const NAK_GANAS = ["Deva","Manushya","Rakshasa","Deva","Deva","Manushya","Deva","Deva","Rakshasa","Rakshasa","Manushya","Deva","Deva","Rakshasa","Deva","Rakshasa","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva","Rakshasa","Rakshasa","Manushya","Deva","Deva"];
      const NAK_NADIS = ["Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya","Aadi","Madhya","Antya"];
      const NAK_YONIS = ["Horse","Elephant","Sheep","Serpent","Serpent","Dog","Cat","Ram","Cat","Rat","Rat","Cow","Buffalo","Tiger","Buffalo","Tiger","Deer","Deer","Dog","Monkey","Mongoose","Monkey","Lion","Horse","Lion","Cow","Elephant"];

      // Enhanced Dasha
      const dashaRemaining = parseFloat(dasha.nextStartsAt) - ageYears;
      const antardashaLord = getAntardasha(dasha.current, ageYears);

      // Detailed interpretations
      const personality = interp.describeTemperament(lagnaInfo, moonInfo, nakInfo, planets);
      const analysis = interp.getPositivesAndChallenges(lagnaInfo, moonInfo, planets);
      const marriageEst = interp.estimateMarriageWindow(ageYears, dasha, planets);
      const timeline = interp.buildLifeTimeline(dasha, planets);
      const remedyList = interp.buildRemedies(lagnaInfo, nakInfo.name, dasha);

      // Career prediction
      const tenthLord = houses[9].lord;
      const careerText = `10th house in ${houses[9].sign} (${houses[9].signEnglish}) ruled by ${tenthLord}. ${getCareerPrediction(tenthLord, planets)}`;

      // Finance prediction
      const secondLord = houses[1].lord;
      const eleventhLord = houses[10].lord;
      const financeText = `2nd house lord ${secondLord} and 11th house lord ${eleventhLord} determine wealth. ${getFinancePrediction(secondLord, eleventhLord, planets)}`;

      // Health prediction
      const sixthLord = houses[5].lord;
      const healthText = `6th house in ${houses[5].sign} (${houses[5].signEnglish}). ${getHealthPrediction(lagnaInfo.element, sixthLord)}`;

      // Spiritual
      const ninthLord = houses[8].lord;
      const spiritualText = `9th house of dharma ruled by ${ninthLord}. ${getSpiritualPrediction(ninthLord, jupH)}`;

      // Marriage detailed
      const seventhLord = houses[6].lord;
      const marriageText = `7th house in ${houses[6].sign} (${houses[6].signEnglish}) ruled by ${seventhLord}. ${marriageEst.signals.join(" ")} Primary window: ${marriageEst.primary}.`;

      // Lucky gems
      const luckyGems = [lagnaInfo.lord, moonInfo.lord].filter((v, i, a) => a.indexOf(v) === i).map((p) => {
        const gems: Record<string, { name: string; finger: string }> = {
          Sun: { name: "Ruby (Manik)", finger: "Ring finger" }, Moon: { name: "Pearl (Moti)", finger: "Little finger" },
          Mars: { name: "Red Coral (Moonga)", finger: "Ring finger" }, Mercury: { name: "Emerald (Panna)", finger: "Little finger" },
          Jupiter: { name: "Yellow Sapphire (Pukhraj)", finger: "Index finger" }, Venus: { name: "Diamond (Heera)", finger: "Middle finger" },
          Saturn: { name: "Blue Sapphire (Neelam)", finger: "Middle finger" },
        };
        return { ...(gems[p] || { name: "Consult astrologer", finger: "-" }), planet: p };
      });

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
        ayanamsa,
        dasha: { ...dasha, remaining: `${Math.max(0, dashaRemaining).toFixed(1)} years`, antardasha: antardashaLord },
        planets, houses, doshas, yogas,
        personality, career: careerText, marriage: marriageText, health: healthText, finance: financeText, spiritual: spiritualText,
        positives: analysis.positives,
        challenges: analysis.challenges,
        remedies: remedyList,
        luckyGems,
        luckyNumbers: [(lagnaInfo.signIndex + 1), (moonInfo.signIndex + 1) % 9 + 1, (nakInfo.index % 9) + 1],
        luckyColors: lagnaInfo.element === "Fire" ? ["Red", "Orange", "Gold"] : lagnaInfo.element === "Earth" ? ["Green", "Brown", "White"] : lagnaInfo.element === "Air" ? ["Blue", "Light Green", "Purple"] : ["Silver", "White", "Sea Green"],
        luckyDay: { Sun: "Sunday", Moon: "Monday", Mars: "Tuesday", Mercury: "Wednesday", Jupiter: "Thursday", Venus: "Friday", Saturn: "Saturday" }[lagnaInfo.lord] || "Monday",
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

// ── Helpers ──────────────────────────────

function getDignity(body: string, signEnglish: string): string {
  const exalted: Record<string, string> = { Sun: "Aries", Moon: "Taurus", Mars: "Capricorn", Mercury: "Virgo", Jupiter: "Cancer", Venus: "Pisces", Saturn: "Libra" };
  const debilitated: Record<string, string> = { Sun: "Libra", Moon: "Scorpio", Mars: "Cancer", Mercury: "Pisces", Jupiter: "Capricorn", Venus: "Virgo", Saturn: "Aries" };
  const own: Record<string, string[]> = { Sun: ["Leo"], Moon: ["Cancer"], Mars: ["Aries", "Scorpio"], Mercury: ["Gemini", "Virgo"], Jupiter: ["Sagittarius", "Pisces"], Venus: ["Taurus", "Libra"], Saturn: ["Capricorn", "Aquarius"] };
  if (exalted[body] === signEnglish) return "Exalted ⬆";
  if (debilitated[body] === signEnglish) return "Debilitated ⬇";
  if (own[body]?.includes(signEnglish)) return "Own Sign ★";
  return "Normal";
}

function getAntardasha(mahadasha: string, age: number): string {
  const VIM_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
  const idx = VIM_ORDER.indexOf(mahadasha);
  const frac = age % 7;
  const sub = Math.floor((frac / 7) * 9);
  return VIM_ORDER[(idx + sub) % 9];
}

function getCareerPrediction(tenthLord: string, planets: PlanetRow[]): string {
  const preds: Record<string, string> = {
    Sun: "Government, administration, or leadership roles suit you best. Authority positions bring success.",
    Moon: "Creative fields, hospitality, nursing, or public-facing roles are favorable. Emotional intelligence is your career asset.",
    Mars: "Engineering, military, sports, surgery, or real estate bring success. Action-oriented careers suit your energy.",
    Mercury: "Business, IT, writing, teaching, or accounting are ideal. Communication skills drive your career growth.",
    Jupiter: "Education, law, finance, consulting, or religious work bring prosperity. Wisdom-based careers excel.",
    Venus: "Arts, entertainment, fashion, beauty, or luxury industries suit you. Creativity is your professional strength.",
    Saturn: "Mining, construction, agriculture, or government jobs bring steady growth. Patience and persistence are key.",
  };
  return preds[tenthLord] || "Career success comes through dedicated effort and building expertise in your chosen field.";
}

function getFinancePrediction(secondLord: string, eleventhLord: string, planets: PlanetRow[]): string {
  const jupH = planets.find((p) => p.body === "Jupiter")?.house ?? 0;
  const venH = planets.find((p) => p.body === "Venus")?.house ?? 0;
  let text = `Wealth accumulation is influenced by ${secondLord} and ${eleventhLord}. `;
  if ([2, 5, 9, 11].includes(jupH)) text += "Jupiter supports financial growth and wise investments. ";
  if ([2, 4, 11].includes(venH)) text += "Venus brings luxury and comfortable lifestyle. ";
  text += "Build savings discipline from an early age for long-term security.";
  return text;
}

function getHealthPrediction(element: string, sixthLord: string): string {
  const elementHealth: Record<string, string> = {
    Fire: "Watch for inflammation, fever, and blood pressure issues. Regular exercise and cooling foods help maintain balance.",
    Earth: "Digestive health and weight management need attention. Structured diet and moderate exercise are essential.",
    Air: "Nervous system and respiratory health require care. Meditation and breathing exercises bring balance.",
    Water: "Emotional health and water retention may be concerns. Emotional stability and regular hydration are important.",
  };
  return elementHealth[element] || "Maintain regular health checkups and balanced lifestyle for optimal well-being.";
}

function getSpiritualPrediction(ninthLord: string, jupiterHouse: number): string {
  let text = `${ninthLord} as 9th lord guides your spiritual path. `;
  if ([1, 5, 9].includes(jupiterHouse)) text += "Jupiter's placement strongly supports spiritual growth, pilgrimage, and higher learning. ";
  text += "Regular prayer, meditation, and selfless service accelerate spiritual evolution.";
  return text;
}

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
