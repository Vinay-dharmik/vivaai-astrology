export interface RashiData {
  name: string;
  english: string;
  lord: string;
  element: string;
  symbol: string;
}

export const RASHI: RashiData[] = [
  { name: "Mesha", english: "Aries", lord: "Mars", element: "Fire", symbol: "♈" },
  { name: "Vrishabha", english: "Taurus", lord: "Venus", element: "Earth", symbol: "♉" },
  { name: "Mithuna", english: "Gemini", lord: "Mercury", element: "Air", symbol: "♊" },
  { name: "Karka", english: "Cancer", lord: "Moon", element: "Water", symbol: "♋" },
  { name: "Simha", english: "Leo", lord: "Sun", element: "Fire", symbol: "♌" },
  { name: "Kanya", english: "Virgo", lord: "Mercury", element: "Earth", symbol: "♍" },
  { name: "Tula", english: "Libra", lord: "Venus", element: "Air", symbol: "♎" },
  { name: "Vrischika", english: "Scorpio", lord: "Mars", element: "Water", symbol: "♏" },
  { name: "Dhanu", english: "Sagittarius", lord: "Jupiter", element: "Fire", symbol: "♐" },
  { name: "Makara", english: "Capricorn", lord: "Saturn", element: "Earth", symbol: "♑" },
  { name: "Kumbha", english: "Aquarius", lord: "Saturn", element: "Air", symbol: "♒" },
  { name: "Meena", english: "Pisces", lord: "Jupiter", element: "Water", symbol: "♓" },
];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
  "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
  "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
  "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati",
];

export const NAK_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu",
  "Jupiter", "Saturn", "Mercury", "Ketu", "Venus", "Sun",
  "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu",
  "Jupiter", "Saturn", "Mercury",
];

export const VIM_ORDER = [
  "Ketu", "Venus", "Sun", "Moon", "Mars",
  "Rahu", "Jupiter", "Saturn", "Mercury",
];

export const VIM_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

export const BODY_ORDER = [
  "Sun", "Moon", "Mercury", "Venus", "Mars",
  "Jupiter", "Saturn", "Rahu", "Ketu",
];

export const ZODIAC_INFO: Record<string, {
  dates: string;
  ruling: string;
  lucky: string;
  color: string;
  trait: string;
}> = {
  aries: { dates: "Mar 21 – Apr 19", ruling: "Mars", lucky: "9", color: "#ef4444", trait: "Bold & Ambitious" },
  taurus: { dates: "Apr 20 – May 20", ruling: "Venus", lucky: "6", color: "#22c55e", trait: "Reliable & Patient" },
  gemini: { dates: "May 21 – Jun 20", ruling: "Mercury", lucky: "5", color: "#eab308", trait: "Curious & Adaptable" },
  cancer: { dates: "Jun 21 – Jul 22", ruling: "Moon", lucky: "2", color: "#64748b", trait: "Nurturing & Intuitive" },
  leo: { dates: "Jul 23 – Aug 22", ruling: "Sun", lucky: "1", color: "#f97316", trait: "Confident & Dramatic" },
  virgo: { dates: "Aug 23 – Sep 22", ruling: "Mercury", lucky: "5", color: "#84cc16", trait: "Analytical & Practical" },
  libra: { dates: "Sep 23 – Oct 22", ruling: "Venus", lucky: "6", color: "#ec4899", trait: "Harmonious & Fair" },
  scorpio: { dates: "Oct 23 – Nov 21", ruling: "Mars", lucky: "9", color: "#dc2626", trait: "Intense & Passionate" },
  sagittarius: { dates: "Nov 22 – Dec 21", ruling: "Jupiter", lucky: "3", color: "#8b5cf6", trait: "Adventurous & Free" },
  capricorn: { dates: "Dec 22 – Jan 19", ruling: "Saturn", lucky: "8", color: "#78716c", trait: "Disciplined & Ambitious" },
  aquarius: { dates: "Jan 20 – Feb 18", ruling: "Saturn", lucky: "8", color: "#06b6d4", trait: "Innovative & Unique" },
  pisces: { dates: "Feb 19 – Mar 20", ruling: "Jupiter", lucky: "3", color: "#6366f1", trait: "Compassionate & Dreamy" },
};
