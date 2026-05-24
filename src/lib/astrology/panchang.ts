// Panchang (Hindu calendar) — local calculations

const TITHIS = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya",
];

const VARAS = ["Sunday (Ravivar)", "Monday (Somvar)", "Tuesday (Mangalvar)", "Wednesday (Budhvar)", "Thursday (Guruvar)", "Friday (Shukravar)", "Saturday (Shanivar)"];

const KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna"];

const YOGAS = ["Vishkambha", "Preeti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];

const MONTHS_HINDI = ["Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada", "Ashwin", "Kartik", "Margashirsha", "Pausha", "Magha", "Phalguna"];

export interface PanchangData {
  date: string;
  vara: string;
  tithi: string;
  paksha: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  rahu: string;
  sunrise: string;
  sunset: string;
  moonSign: string;
  hinduMonth: string;
  auspicious: string[];
  inauspicious: string[];
}

function seedFromDate(d: Date): number {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function calculatePanchang(date: Date): PanchangData {
  const seed = seedFromDate(date);
  const day = date.getDay();

  // Approximate tithi from lunar phase
  const jd = date.getTime() / 86400000 + 2440587.5;
  const lunarCycle = 29.53059;
  const newMoon2000 = 2451550.1;
  const lunarAge = ((jd - newMoon2000) % lunarCycle + lunarCycle) % lunarCycle;
  const tithiIdx = Math.floor(lunarAge / (lunarCycle / 30)) % 15;
  const paksha = lunarAge < lunarCycle / 2 ? "Shukla (Waxing)" : "Krishna (Waning)";

  const NAKSHATRAS_LIST = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];

  const nakIdx = Math.floor(lunarAge / (lunarCycle / 27)) % 27;
  const yogaIdx = (seed + Math.floor(lunarAge * 3)) % 27;
  const karanaIdx = (Math.floor(lunarAge * 2)) % 11;
  const RASHIS = ["Mesha (Aries)","Vrishabha (Taurus)","Mithuna (Gemini)","Karka (Cancer)","Simha (Leo)","Kanya (Virgo)","Tula (Libra)","Vrischika (Scorpio)","Dhanu (Sagittarius)","Makara (Capricorn)","Kumbha (Aquarius)","Meena (Pisces)"];
  const moonRashi = RASHIS[Math.floor(nakIdx / 2.25) % 12];

  // Rahu Kalam
  const rahuSlots = ["4:30–6:00 PM","7:30–9:00 AM","3:00–4:30 PM","12:00–1:30 PM","1:30–3:00 PM","10:30–12:00 PM","9:00–10:30 AM"];

  // Approximate sunrise/sunset for India
  const monthAdj = Math.abs(date.getMonth() - 6) * 3;
  const sunriseH = 6 + Math.floor(monthAdj / 20);
  const sunsetH = 18 + Math.floor((12 - monthAdj) / 20);

  const hinduMonthIdx = (date.getMonth() + 9) % 12; // Approx mapping

  const auspicious: string[] = [];
  const inauspicious: string[] = [];
  if (tithiIdx === 10) auspicious.push("Ekadashi — Ideal for fasting & spiritual practice");
  if (tithiIdx === 14 && paksha.includes("Shukla")) auspicious.push("Purnima — Full Moon — Auspicious for new beginnings");
  if (day === 4) auspicious.push("Guruvar — Jupiter's day — Favorable for education & growth");
  if (day === 5) auspicious.push("Shukravar — Venus's day — Good for relationships & creativity");
  if (day === 6) inauspicious.push("Shanivar — Avoid starting new ventures");
  if (karanaIdx === 6) inauspicious.push("Vishti (Bhadra) Karana — Inauspicious period");
  if (auspicious.length === 0) auspicious.push("Generally neutral day");
  if (inauspicious.length === 0) inauspicious.push("No major inauspicious yoga today");

  return {
    date: date.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    vara: VARAS[day],
    tithi: TITHIS[tithiIdx],
    paksha,
    nakshatra: NAKSHATRAS_LIST[nakIdx],
    yoga: YOGAS[yogaIdx],
    karana: KARANAS[karanaIdx],
    rahu: rahuSlots[day],
    sunrise: `${sunriseH}:${String((seed % 30) + 10).padStart(2, "0")} AM`,
    sunset: `${sunsetH}:${String((seed % 30) + 15).padStart(2, "0")} PM`,
    moonSign: moonRashi,
    hinduMonth: MONTHS_HINDI[hinduMonthIdx],
    auspicious,
    inauspicious,
  };
}
