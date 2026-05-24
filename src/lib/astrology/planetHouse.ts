import { BODY_ORDER } from "@/lib/astrology/constants";

export interface PlanetHouseData {
  planet: string;
  house: number;
  title: string;
  overview: string;
  career: string;
  relationships: string;
  health: string;
  strengths: string[];
  challenges: string[];
  remedies: string[];
}

const HOUSE_NAMES = ["","1st (Lagna)","2nd (Dhana)","3rd (Sahaja)","4th (Sukha)","5th (Putra)","6th (Shatru)","7th (Kalatra)","8th (Ayur)","9th (Dharma)","10th (Karma)","11th (Labha)","12th (Vyaya)"];
const HOUSE_TOPICS = ["","Self & Personality","Wealth & Family","Siblings & Courage","Home & Comfort","Children & Intelligence","Enemies & Health","Marriage & Partnership","Longevity & Transformation","Luck & Dharma","Career & Status","Gains & Aspirations","Losses & Liberation"];

const PLANET_NATURES: Record<string, { nature: string; signifies: string; gem: string }> = {
  Sun: { nature: "authority and vitality", signifies: "soul, father, government", gem: "Ruby" },
  Moon: { nature: "emotions and intuition", signifies: "mind, mother, emotions", gem: "Pearl" },
  Mercury: { nature: "intellect and communication", signifies: "speech, trade, learning", gem: "Emerald" },
  Venus: { nature: "love and luxury", signifies: "beauty, marriage, arts", gem: "Diamond" },
  Mars: { nature: "energy and courage", signifies: "action, land, siblings", gem: "Red Coral" },
  Jupiter: { nature: "wisdom and expansion", signifies: "knowledge, children, dharma", gem: "Yellow Sapphire" },
  Saturn: { nature: "discipline and karma", signifies: "duty, longevity, service", gem: "Blue Sapphire" },
  Rahu: { nature: "ambition and illusion", signifies: "foreign, technology, obsession", gem: "Hessonite" },
  Ketu: { nature: "spirituality and detachment", signifies: "moksha, past karma, intuition", gem: "Cat's Eye" },
};

export function getPlanetHouseData(planet: string, house: number): PlanetHouseData {
  const p = PLANET_NATURES[planet] || PLANET_NATURES.Sun;
  const houseName = HOUSE_NAMES[house];
  const houseTopic = HOUSE_TOPICS[house];

  // Generate contextual content based on planet+house combination
  const benefic = ["Jupiter","Venus","Moon","Mercury"].includes(planet);
  const malefic = ["Saturn","Mars","Rahu","Ketu"].includes(planet);

  const overview = `When ${planet}, the planet of ${p.nature}, occupies the ${houseName} House (House of ${houseTopic}), it creates a powerful influence on the native's ${houseTopic.toLowerCase()}. ${planet} signifies ${p.signifies} in Vedic astrology. ${benefic ? `As a natural benefic, ${planet} generally brings favorable results in this placement, enhancing the positive significations of the ${houseName} house.` : `As a naturally challenging planet, ${planet} can bring both transformative growth and obstacles in the areas governed by the ${houseName} house, depending on its dignity and aspects.`}`;

  const careerEffects = house <= 4
    ? `${planet} in the ${houseName} house ${benefic ? "supports" : "challenges"} career through its influence on ${houseTopic.toLowerCase()}. ${benefic ? "Professional growth comes naturally with determination." : "Career success requires patience and perseverance."}`
    : house <= 8
    ? `This placement ${benefic ? "enhances" : "tests"} career prospects through ${houseTopic.toLowerCase()}. ${planet}'s energy here ${benefic ? "attracts opportunities" : "demands hard work"} in professional life.`
    : `${planet} in the ${houseName} house ${benefic ? "blesses" : "transforms"} career trajectory. ${benefic ? "Success in higher positions and leadership roles." : "Gradual but steady professional advancement after overcoming initial obstacles."}`;

  const relEffects = [3,5,7,11].includes(house)
    ? `${planet} here ${benefic ? "enhances" : "complicates"} relationships and social connections. ${house === 7 ? `The ${houseName} house directly governs marriage — ${planet} here ${benefic ? "indicates a loving, supportive spouse" : "may bring delays or challenges in marriage that ultimately lead to deeper understanding"}.` : `Social bonds are ${benefic ? "strengthened" : "tested"} by this placement.`}`
    : `Relationships are ${benefic ? "positively" : "indirectly"} influenced by ${planet} in the ${houseName} house. ${benefic ? "Harmony in personal connections." : "Lessons in patience and understanding with loved ones."}`;

  const healthEffects = [1,6,8].includes(house)
    ? `Health requires attention with ${planet} in the ${houseName} house. ${planet === "Mars" ? "High energy but prone to inflammation and injuries." : planet === "Saturn" ? "Chronic conditions possible — regular checkups recommended." : `${benefic ? "Generally supportive of good health" : "Periodic health challenges that strengthen resilience"}.`}`
    : `${planet} in the ${houseName} house has ${benefic ? "a supportive" : "a moderate"} influence on overall health and vitality.`;

  const strengths = [
    benefic ? `Natural talent in ${houseTopic.toLowerCase()}-related areas` : `Transformative growth through ${houseTopic.toLowerCase()} challenges`,
    `${planet}'s energy brings ${benefic ? "blessings" : "deep wisdom"} to ${houseName} house matters`,
    house >= 9 ? "Strong dharmic orientation and spiritual inclination" : "Practical approach to material success",
    `${p.gem} gemstone can amplify positive effects`,
  ];

  const challenges = [
    malefic ? `May face obstacles in ${houseTopic.toLowerCase()} initially` : `Over-attachment to ${houseTopic.toLowerCase()} matters`,
    house === 8 || house === 12 ? "Hidden enemies or unexpected transformations possible" : "Balancing material and spiritual pursuits",
    `Periods of ${planet} Mahadasha/Antardasha may intensify effects`,
  ];

  const remedies = [
    `Wear ${p.gem} gemstone after consulting an astrologer`,
    `Chant ${planet} beej mantra 108 times daily`,
    planet === "Saturn" ? "Feed crows on Saturdays, donate black sesame" : planet === "Rahu" ? "Donate to elderly, avoid alcohol" : planet === "Ketu" ? "Meditate daily, donate blankets" : `Offer prayers to ${planet} on its ruling day`,
    `Perform ${planet} Graha Shanti Puja for enhanced results`,
  ];

  return {
    planet, house,
    title: `${planet} in ${houseName} House`,
    overview, career: careerEffects, relationships: relEffects, health: healthEffects,
    strengths, challenges, remedies,
  };
}

export const PLANETS_FOR_HOUSES = BODY_ORDER; // Sun thru Ketu (9)
export const HOUSES = Array.from({ length: 12 }, (_, i) => i + 1);
export { HOUSE_NAMES, HOUSE_TOPICS };
