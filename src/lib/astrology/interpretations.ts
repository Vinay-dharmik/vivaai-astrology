/**
 * Chart-specific Vedic interpretation engine.
 * Every function produces text driven by actual planetary placements,
 * not generic templates. Output quality targets 90%+ alignment with
 * classical Vedic astrology rules (Parashara, Jaimini, Brihat Jataka).
 */

import type { RashiResult, NakshatraResult, DashaSummary, PlanetRow } from "./calculations";

type Rows = PlanetRow[];

function planet(rows: Rows, name: string) { return rows.find((r) => r.body === name); }
function houseOf(rows: Rows, name: string) { return planet(rows, name)?.house ?? 0; }
function signOf(rows: Rows, name: string) { return planet(rows, name)?.signIndex ?? -1; }
function dignity(rows: Rows, name: string) { return planet(rows, name)?.dignity ?? "Normal"; }

const KENDRA = [1, 4, 7, 10];
const TRIKONA = [1, 5, 9];
const UPACHAYA = [3, 6, 10, 11];
const DUSTHANA = [6, 8, 12];

// ── Temperament ──────────────────────────────────────────

export function describeTemperament(
  lagna: RashiResult,
  moon: RashiResult,
  nak: NakshatraResult,
  rows: Rows
): string {
  const lagnaEl = lagna.element;
  const moonEl = moon.element;
  const mercH = houseOf(rows, "Mercury");
  const jupH = houseOf(rows, "Jupiter");
  const satH = houseOf(rows, "Saturn");
  const marsH = houseOf(rows, "Mars");
  const sunH = houseOf(rows, "Sun");

  // Core personality from Lagna
  const lagnaDesc: Record<string, string> = {
    Fire: "dynamic, self-motivated and action-oriented",
    Earth: "steady, practical and methodical",
    Air: "quick-thinking, social and intellectually curious",
    Water: "intuitive, empathetic and emotionally perceptive",
  };

  // Moon sign modifies emotional nature
  const moonDesc: Record<string, string> = {
    Fire: "emotionally passionate and spontaneous",
    Earth: "emotionally stable and comfort-seeking",
    Air: "emotionally analytical and communicative",
    Water: "emotionally deep, sensitive and receptive",
  };

  // Nakshatra flavour
  const nakFlavour: Record<string, string> = {
    Ashwini: "pioneering and swift in action",
    Bharani: "determined and carrying deep karmic responsibility",
    Krittika: "sharp, critical and goal-focused",
    Rohini: "artistic, sensual and deeply devoted",
    Mrigashira: "eternally curious and perpetually seeking",
    Ardra: "intense, transformative and emotionally raw",
    Punarvasu: "optimistic, renewal-oriented and philosophical",
    Pushya: "nurturing, protective and community-focused",
    Ashlesha: "perceptive, strategic and emotionally complex",
    Magha: "regal, tradition-respecting and leadership-oriented",
    "Purva Phalguni": "creative, pleasure-loving and socially magnetic",
    "Uttara Phalguni": "reliable, dutiful and quietly ambitious",
    Hasta: "skilled, quick-handed and practically intelligent",
    Chitra: "creative, perfectionist and aesthetically driven",
    Swati: "independent, flexible and commerce-savvy",
    Vishakha: "focused, goal-driven and intensely purposeful",
    Anuradha: "loyal, disciplined and spiritually inclined",
    Jyeshtha: "protective, authoritative and intensely responsible",
    Mula: "investigative, root-seeking and transformative",
    "Purva Ashadha": "passionate, visionary and philosophical",
    "Uttara Ashadha": "principled, steady and achievement-oriented",
    Shravana: "wise, listening-oriented and knowledge-hungry",
    Dhanishta: "wealthy-aspiring, musical and group-oriented",
    Shatabhisha: "healers, secretive and independent-minded",
    "Purva Bhadrapada": "intense, idealistic and unconventionally spiritual",
    "Uttara Bhadrapada": "deep, patient and karmically wise",
    Revati: "compassionate, nurturing and spiritually evolved",
  };

  const nak_str = nakFlavour[nak.name] || "versatile and multi-talented";

  // Mercury placement affects communication style
  const mercDesc = KENDRA.includes(mercH) || [2, 5].includes(mercH)
    ? "communicates with clarity and natural persuasion"
    : mercH === 0 ? "has a reserved but precise communication style"
    : DUSTHANA.includes(mercH) ? "thinks deeply but may second-guess expression"
    : "expresses ideas thoughtfully";

  // Sun placement affects ego and confidence
  const sunDesc = [1, 5, 10].includes(sunH)
    ? "Confidence and self-expression come naturally"
    : [6, 7, 12].includes(sunH)
    ? "Confidence is built through challenge and experience"
    : "Self-worth is grounded and internally motivated";

  // Jupiter's placement affects wisdom
  const jupDesc = TRIKONA.includes(jupH) || KENDRA.includes(jupH)
    ? "wisdom and good judgment are natural gifts"
    : DUSTHANA.includes(jupH) ? "wisdom emerges after overcoming obstacles"
    : "ethical values guide decision-making consistently";

  // Saturn influences discipline
  const satDesc = [3, 6, 10, 11].includes(satH)
    ? "Strong work ethic and capacity for sustained effort"
    : [1, 7].includes(satH)
    ? "Serious in nature, cautious in relationships"
    : "Discipline grows strongest during Saturn periods";

  return [
    `${lagna.name} Lagna (${lagnaEl} sign) makes this native ${lagnaDesc[lagnaEl]}. The ${moon.name} Moon (${moon.lord}-ruled) creates an ${moonDesc[moonEl]} inner world.`,
    `Born in ${nak.name} Nakshatra, this native is ${nak_str}. ${sunDesc}. ${mercDesc.charAt(0).toUpperCase() + mercDesc.slice(1)}.`,
    `Jupiter in the ${jupH}th house means ${jupDesc}. ${satDesc}.`,
  ].join(" ");
}

// ── Career & Profession ──────────────────────────────────

export function predictCareer(
  lagna: RashiResult,
  rows: Rows,
  houses: { house: number; signEnglish: string; lord: string }[]
): string {
  const tenthH = houses[9]; // 10th house (index 9)
  const tenthLord = tenthH.lord;
  const tenthLordH = houseOf(rows, tenthLord);
  const tenthLordDig = dignity(rows, tenthLord);
  const jupH = houseOf(rows, "Jupiter");
  const satH = houseOf(rows, "Saturn");
  const marsH = houseOf(rows, "Mars");
  const sunH = houseOf(rows, "Sun");
  const merH = houseOf(rows, "Mercury");
  const venH = houseOf(rows, "Venus");

  // Career indicators by 10th lord strength
  const lordStrong = tenthLordDig === "Exalted ⬆" || tenthLordDig === "Own Sign ★";
  const lordInKendra = KENDRA.includes(tenthLordH);
  const lordInTrikona = TRIKONA.includes(tenthLordH);
  const lordInDusthana = DUSTHANA.includes(tenthLordH);

  // Identify career domain by planets in or aspecting 10th
  const planetsIn10th = rows.filter((r) => r.house === 10).map((r) => r.body);
  const domains: string[] = [];

  if (planetsIn10th.includes("Sun") || sunH === 10 || [1, 10].includes(tenthLordH) && tenthLord === "Sun")
    domains.push("government, administration, politics, or leadership roles");
  if (planetsIn10th.includes("Moon") || tenthLord === "Moon")
    domains.push("hospitality, healthcare, public service, or real estate");
  if (planetsIn10th.includes("Mars") || [3, 6, 10].includes(marsH))
    domains.push("engineering, military, sports, law enforcement, or real estate");
  if (planetsIn10th.includes("Mercury") || [1, 3, 6, 10].includes(merH))
    domains.push("communication, business, finance, IT, or education");
  if (planetsIn10th.includes("Jupiter") || [1, 5, 9, 10].includes(jupH))
    domains.push("education, law, spirituality, finance, or advisory roles");
  if (planetsIn10th.includes("Venus") || [2, 4, 5, 7, 10].includes(venH))
    domains.push("arts, media, fashion, luxury goods, or entertainment");
  if (planetsIn10th.includes("Saturn") || [3, 6, 10, 11].includes(satH))
    domains.push("industry, infrastructure, research, or long-term professional service");
  if (planetsIn10th.includes("Rahu"))
    domains.push("technology, foreign connections, unconventional fields, or mass media");

  // Default domain from lagna element
  if (!domains.length) {
    const defaultByElement: Record<string, string> = {
      Fire: "leadership, entrepreneurship, or competitive fields",
      Earth: "finance, management, agriculture, or property",
      Air: "communication, education, or social professions",
      Water: "healing arts, creative fields, or service industries",
    };
    domains.push(defaultByElement[lagna.element] || "multi-disciplinary fields");
  }

  const domainStr = domains.slice(0, 2).join(" or ");
  const strength = lordStrong ? "very strong" : lordInKendra || lordInTrikona ? "strong" : lordInDusthana ? "challenged but persistent" : "moderate";

  const timing = lordInDusthana
    ? "Career may face initial obstacles. Significant breakthrough expected after Saturn's first return (~29 years)."
    : lordStrong
    ? "Career rises steadily. Peak recognition likely during 10th lord's Mahadasha or Jupiter transit over 10th house."
    : "Career growth is consistent. Promotions during beneficial Dasha periods of the 10th or 11th lord.";

  return `10th house in ${tenthH.signEnglish} ruled by ${tenthLord} (${strength} — in ${tenthLordH}th house). Best-suited career domains: ${domainStr}. ${timing}`;
}

// ── Finance & Wealth ─────────────────────────────────────

export function predictFinance(
  rows: Rows,
  houses: { house: number; signEnglish: string; lord: string }[]
): string {
  const l2 = houses[1].lord; // 2nd house lord
  const l11 = houses[10].lord; // 11th house lord
  const l5 = houses[4].lord; // 5th (speculation/investments)
  const l9 = houses[8].lord; // 9th (fortune/luck)

  const l2H = houseOf(rows, l2);
  const l11H = houseOf(rows, l11);
  const jupH = houseOf(rows, "Jupiter");
  const venH = houseOf(rows, "Venus");

  const l2Dig = dignity(rows, l2);
  const l11Dig = dignity(rows, l11);

  const wealthStrong = (l2Dig === "Exalted ⬆" || l2Dig === "Own Sign ★") ||
    KENDRA.includes(l2H) || TRIKONA.includes(l2H);

  const incomePotential = (l11Dig === "Exalted ⬆" || l11Dig === "Own Sign ★") ||
    UPACHAYA.includes(l11H);

  // Venus in good house → luxury/comfort
  const luxuryGood = [1, 2, 4, 5, 7, 10, 11].includes(venH);
  // Jupiter in good house → overall prosperity
  const jupGood = KENDRA.includes(jupH) || TRIKONA.includes(jupH);

  let outlook = "moderate";
  if (wealthStrong && incomePotential) outlook = "excellent";
  else if (wealthStrong || incomePotential) outlook = "good";
  else if (DUSTHANA.includes(l2H) && DUSTHANA.includes(l11H)) outlook = "challenging";

  const advice = outlook === "excellent"
    ? "Multiple income streams are naturally indicated. Savings and investments made during Jupiter Mahadasha yield lasting wealth."
    : outlook === "good"
    ? "Steady financial growth. Best earnings during 2nd or 11th lord's Dasha period. Discipline in spending maximises accumulation."
    : outlook === "challenging"
    ? "Financial discipline is critical. Avoid speculation and high-risk ventures. Wealth grows through service and persistent effort after age 30."
    : "Consistent income with moderate accumulation. Invest in property or education for long-term security.";

  return `2nd lord ${l2} (${l2Dig}) indicates wealth from ${getWealthSource(l2, l2H)}. 11th lord ${l11} governs income (${l11Dig === "Exalted ⬆" || l11Dig === "Own Sign ★" ? "strong gains potential" : "steady income"}). Jupiter in ${jupH}th house ${jupGood ? "amplifies prosperity" : "requires patience for financial growth"}. Overall financial outlook: ${outlook}. ${advice}`;
}

function getWealthSource(lord: string, house: number): string {
  const sourceByLord: Record<string, string> = {
    Sun: "government service, leadership positions, or father's support",
    Moon: "business with masses, hospitality, or inheritance",
    Mars: "real estate, technical skills, or entrepreneurship",
    Mercury: "trade, communication, writing, or intellectual services",
    Jupiter: "education, advisory roles, financial services, or spirituality",
    Venus: "arts, luxury goods, relationships, or creative fields",
    Saturn: "hard work, industry, and long-term discipline",
    Rahu: "unconventional sources, foreign connections, or speculation",
    Ketu: "spiritual service, occult, or ancestral property",
  };
  const sourceByHouse = KENDRA.includes(house) ? " (actively earned)" :
    TRIKONA.includes(house) ? " (luck supports)" :
    DUSTHANA.includes(house) ? " (after overcoming obstacles)" : " (steadily built)";
  return (sourceByLord[lord] || "varied sources") + sourceByHouse;
}

// ── Marriage & Relationships ──────────────────────────────

export function predictMarriage(
  ageYears: number,
  rows: Rows,
  houses: { house: number; signEnglish: string; lord: string }[],
  navamsaData?: { planet: string; navamsaEnglish: string; dignity: string }[]
): string {
  const seventhH = houses[6]; // 7th house
  const l7 = seventhH.lord;
  const l7H = houseOf(rows, l7);
  const l7Dig = dignity(rows, l7);
  const venH = houseOf(rows, "Venus");
  const venDig = dignity(rows, "Venus");
  const jupH = houseOf(rows, "Jupiter");
  const marsH = houseOf(rows, "Mars");
  const satH = houseOf(rows, "Saturn");

  // 7th lord placement determines marriage quality
  const l7Strong = l7Dig === "Exalted ⬆" || l7Dig === "Own Sign ★";
  const l7InKendra = KENDRA.includes(l7H);
  const l7InDusthana = DUSTHANA.includes(l7H);

  // Venus (karaka for marriage) placement
  const venStrong = venDig === "Exalted ⬆" || venDig === "Own Sign ★";
  const venGoodH = [1, 2, 4, 5, 7, 9, 10, 11].includes(venH);

  // Timing estimate
  let earlyAge = 24, lateAge = 30;
  if (venStrong || l7Strong) earlyAge = 22;
  if ([7, 8, 10].includes(satH)) { earlyAge += 2; lateAge += 3; }
  if ([7].includes(marsH) && !l7Strong) lateAge += 2;
  if (jupH === 7 || jupH === 5 || jupH === 9) earlyAge -= 1;

  // Navamsa insight for marriage quality
  const navamsaVenus = navamsaData?.find((n) => n.planet === "Venus");
  const navamsaInsight = navamsaVenus
    ? navamsaVenus.dignity === "Exalted ⬆" || navamsaVenus.dignity === "Own Sign ★" || navamsaVenus.dignity === "Vargottama ✦"
      ? "D9 Navamsa shows Venus strongly placed — confirms a supportive, loving partnership."
      : navamsaVenus.dignity === "Debilitated ⬇"
      ? "D9 Navamsa Venus is debilitated — partnership may require more effort and understanding."
      : "Navamsa supports a stable marital relationship."
    : "";

  const spouseQualities = getSpouseQualities(l7, seventhH.signEnglish, venH);

  const qualityDesc = l7Strong && venGoodH
    ? "Very favourable marriage indications. Spouse brings harmony, stability and mutual growth."
    : l7InDusthana && !l7Strong
    ? "Marriage requires conscious effort and communication. Late-blooming but lasting bond."
    : "Balanced marriage with natural ups and downs. Mutual respect sustains the relationship.";

  return `7th house in ${seventhH.signEnglish} ruled by ${l7} (${l7Dig}) — ${l7InKendra ? "placed in a kendra, excellent for marriage" : l7InDusthana ? "in a dusthana, patience needed" : "moderate placement"}. ${qualityDesc} Spouse traits: ${spouseQualities}. ${navamsaInsight} Likely marriage window: ages ${earlyAge}–${lateAge} (primary), ${lateAge + 1}–${lateAge + 5} (secondary).`;
}

function getSpouseQualities(l7: string, seventh: string, venH: number): string {
  const bySign: Record<string, string> = {
    Aries: "dynamic, independent and self-assured", Taurus: "stable, sensual and aesthetic",
    Gemini: "witty, communicative and intellectually engaging", Cancer: "nurturing, emotionally supportive and home-loving",
    Leo: "confident, generous and socially prominent", Virgo: "analytical, practical and service-oriented",
    Libra: "balanced, socially graceful and harmonious", Scorpio: "intense, loyal and emotionally complex",
    Sagittarius: "philosophical, adventurous and freedom-loving", Capricorn: "disciplined, ambitious and responsible",
    Aquarius: "independent, innovative and unconventional", Pisces: "compassionate, spiritual and artistically inclined",
  };
  const byLord: Record<string, string> = {
    Sun: " with natural authority and leadership", Moon: " with nurturing and emotional depth",
    Mars: " energetic and courageous", Mercury: " intelligent and communicative",
    Jupiter: " wise, educated and spiritually inclined", Venus: " beautiful, artistic and charming",
    Saturn: " hardworking, disciplined and reliable", Rahu: " unconventional or from a different background",
    Ketu: " spiritually oriented or from a different cultural background",
  };
  return (bySign[seventh] || "varied personality") + (byLord[l7] || "");
}

// ── Health & Wellness ────────────────────────────────────

export function predictHealth(
  lagna: RashiResult,
  rows: Rows,
  houses: { house: number; signEnglish: string; lord: string }[]
): string {
  const l1 = houses[0].lord; // Lagna lord
  const l6 = houses[5].lord; // 6th lord
  const l8 = houses[7].lord; // 8th lord
  const l1H = houseOf(rows, l1);
  const l6H = houseOf(rows, l6);
  const l1Dig = dignity(rows, l1);
  const satH = houseOf(rows, "Saturn");
  const marsH = houseOf(rows, "Mars");
  const sunH = houseOf(rows, "Sun");
  const moonH = houseOf(rows, "Moon");

  // Body parts by Lagna
  const bodyBySign: Record<string, string> = {
    Aries: "head, brain and adrenals", Taurus: "neck, throat and thyroid",
    Gemini: "lungs, shoulders and nervous system", Cancer: "stomach, chest and digestion",
    Leo: "heart, spine and circulation", Virgo: "intestines, abdomen and metabolism",
    Libra: "kidneys, lower back and skin", Scorpio: "reproductive organs and excretion",
    Sagittarius: "hips, thighs and liver", Capricorn: "bones, joints and knees",
    Aquarius: "ankles, calves and circulatory system", Pisces: "feet, immune system and lymphatics",
  };

  const vulnerableArea = bodyBySign[lagna.english] || "varied systems";

  // Saturn afflictions → chronic issues
  const satAfflic = [1, 6, 8].includes(satH);
  // Mars afflictions → inflammation/injury
  const marsAfflic = [1, 6, 8].includes(marsH);
  // Lagna lord strength
  const lagnaStrong = l1Dig === "Exalted ⬆" || l1Dig === "Own Sign ★" || KENDRA.includes(l1H) || TRIKONA.includes(l1H);
  // 6th lord in dusthana → manageable illness
  const sixthInDusthana = DUSTHANA.includes(l6H);

  let constitutional = "robust";
  if (lagnaStrong) constitutional = "strong and resilient";
  else if (satAfflic && marsAfflic) constitutional = "requiring consistent health management";
  else if (satAfflic) constitutional = "prone to chronic or recurring conditions";
  else if (marsAfflic) constitutional = "susceptible to inflammatory conditions or injuries";

  const mental = [4, 5, 9].includes(moonH)
    ? "Emotional wellbeing is generally positive."
    : [6, 8, 12].includes(moonH)
    ? "Emotional health requires conscious nurturing — meditation and routine provide stability."
    : "Emotional balance is maintained through relationships and purpose.";

  const reco = satAfflic
    ? "Regular health check-ups, oil massages, and consistent sleep routines are advised."
    : marsAfflic
    ? "Avoid excessive heat, spicy food, and overexertion. Physical activity in moderated, structured form is beneficial."
    : "Maintain consistent dietary habits and moderate exercise aligned with your constitution.";

  return `Lagna is ${lagna.english} — constitution is ${constitutional}. Key area of attention: ${vulnerableArea}. 6th lord ${l6} (disease indicator) ${sixthInDusthana ? "in a dusthana — illnesses are generally manageable and short-lived" : `in ${l6H}th house — monitor this system proactively`}. ${mental} ${reco}`;
}

// ── Spiritual Path ────────────────────────────────────────

export function predictSpiritual(
  rows: Rows,
  houses: { house: number; signEnglish: string; lord: string }[]
): string {
  const l9H = houses[8].lord; // 9th lord
  const l9HH = houseOf(rows, l9H);
  const l9Dig = dignity(rows, l9H);
  const jupH = houseOf(rows, "Jupiter");
  const ketuH = houseOf(rows, "Ketu");
  const l12H = houseOf(rows, houses[11].lord);

  const l9Strong = l9Dig === "Exalted ⬆" || l9Dig === "Own Sign ★";
  const l9InTrikona = TRIKONA.includes(l9HH);
  const jupInTrikona = TRIKONA.includes(jupH) || KENDRA.includes(jupH);
  const ketuGood = [4, 9, 12].includes(ketuH);

  let path = "general spiritual growth through life experience";
  if (l9Strong && jupInTrikona) path = "a naturally religious and dharmic life, possibly a guide or teacher to others";
  else if (ketuGood) path = "deep spiritual detachment, occult wisdom and past-life karma resolution";
  else if ([4, 9, 12].includes(l9HH)) path = "contemplative spirituality, pilgrimage and connection with higher learning";
  else if ([6, 8].includes(l9HH)) path = "spirituality through hardship, service and transformation — a soulful journey";

  const practice = jupInTrikona
    ? "Japa (mantra repetition), selfless service (seva) and learning sacred texts are naturally suited."
    : ketuGood
    ? "Meditation, past-life regression and non-attachment practices resonate deeply."
    : "Daily prayer, gratitude practice and attending spiritual discourses build the spiritual foundation.";

  return `9th house of dharma governed by ${l9H} (${l9Dig}) in ${l9HH}th house. Spiritual path is ${path}. ${practice} Ketu in ${ketuH}th house ${ketuGood ? "supports liberation and intuitive wisdom" : "asks for gradual release of material attachments"}.`;
}

// ── Positives & Challenges ───────────────────────────────

export interface Challenge { issue: string; solution: string; }

export function getPositivesAndChallenges(
  lagna: RashiResult,
  moon: RashiResult,
  rows: Rows,
  houses?: { house: number; signEnglish: string; lord: string }[]
): { positives: string[]; challenges: Challenge[] } {
  const jupH = houseOf(rows, "Jupiter");
  const venH = houseOf(rows, "Venus");
  const satH = houseOf(rows, "Saturn");
  const rahuH = houseOf(rows, "Rahu");
  const marsH = houseOf(rows, "Mars");
  const sunH = houseOf(rows, "Sun");
  const mercH = houseOf(rows, "Mercury");

  const positives: string[] = [];
  const challenges: Challenge[] = [];

  // Jupiter positives
  if (KENDRA.includes(jupH) || TRIKONA.includes(jupH))
    positives.push(`Jupiter in ${jupH}th house — natural wisdom, luck and expansion in career or education.`);
  else if (jupH === 11)
    positives.push("Jupiter in 11th house — strong gains, large social network and fulfilled desires.");

  // Venus positives
  if ([1, 2, 4, 5, 7, 10, 11].includes(venH))
    positives.push(`Venus in ${venH}th house — charm, creativity and harmonious relationships come naturally.`);

  // Sun in positive house
  if ([1, 5, 9, 10, 11].includes(sunH))
    positives.push(`Sun in ${sunH}th house — confidence, recognition from authority figures and leadership ability.`);

  // Mercury in positive house
  if ([1, 3, 5, 10].includes(mercH))
    positives.push(`Mercury in ${mercH}th house — sharp intellect, strong communication and business aptitude.`);

  // Lagna element strength
  positives.push(`${lagna.element}-element Lagna (${lagna.english}) — core strengths include ${
    lagna.element === "Fire" ? "initiative, courage and natural leadership" :
    lagna.element === "Earth" ? "persistence, reliability and practical mastery" :
    lagna.element === "Air" ? "adaptability, social intelligence and rapid learning" :
    "intuition, emotional intelligence and deep empathy"
  }.`);

  // Saturn challenges
  if ([1, 7, 8].includes(satH))
    challenges.push({
      issue: `Saturn in ${satH}th house — delays in ${satH === 7 ? "marriage or partnerships" : satH === 8 ? "inheritance or transformation events" : "self-confidence and physical vitality"}.`,
      solution: "Saturn rewards discipline. Consistent long-term action outperforms bursts of energy. Blue Sapphire or Iron ring (post Saturn Mahadasha consultation).",
    });
  else if (satH === 10)
    challenges.push({
      issue: "Saturn in 10th — career recognition arrives slowly despite ability. Superiors may be demanding.",
      solution: "Treat every role as a learning opportunity. Saturn's Mahadasha can be a peak career period if groundwork is laid early.",
    });

  // Rahu challenges
  if ([1, 7, 8, 12].includes(rahuH))
    challenges.push({
      issue: `Rahu in ${rahuH}th house — unconventional desires, possible confusion or misdirection in ${rahuH === 7 ? "relationships" : rahuH === 8 ? "occult or joint finances" : rahuH === 12 ? "foreign matters or sleep" : "self-identity and direction"}.`,
      solution: "Rahu is best handled with focus and grounding practices. Avoid shortcuts and deceptive methods. Hessonite (Gomed) after proper astrological consultation.",
    });

  // Mars challenges
  if ([2, 4, 7, 12].includes(marsH))
    challenges.push({
      issue: `Mars in ${marsH}th house — impulsive tendencies affecting ${marsH === 7 ? "relationships" : marsH === 2 ? "speech and family harmony" : marsH === 4 ? "home peace" : "subconscious restlessness"}.`,
      solution: "Physical exercise channels Mars energy constructively. Recite Mangal mantra on Tuesdays. Red Coral gemstone may be considered.",
    });

  // Moon vulnerabilities
  if (moon.element === "Water" || [6, 8, 12].includes(houseOf(rows, "Moon")))
    challenges.push({
      issue: "Heightened emotional sensitivity — prone to over-absorbing others' energy or anxiety under stress.",
      solution: "Create strong daily routines, limit stimulation before sleep. Meditation and journaling provide stability. Pearl (Moti) strengthens Moon.",
    });

  // Fill minimum positive if needed
  if (positives.length < 3)
    positives.push("Natural resilience and adaptability ensure long-term personal growth and self-improvement.");

  return { positives, challenges };
}

// ── Marriage Estimate ────────────────────────────────────

export interface MarriageEstimate {
  primary: string;
  secondary: string;
  signals: string[];
}

export function estimateMarriageWindow(
  ageYears: number,
  dasha: DashaSummary,
  rows: Rows
): MarriageEstimate {
  const venH = houseOf(rows, "Venus");
  const jupH = houseOf(rows, "Jupiter");
  const satH = houseOf(rows, "Saturn");
  const l7H = rows.find((r) => r.house === 7)?.house ?? 7;
  const signals: string[] = [];
  let start = 24, end = 29;

  if ([1, 2, 5, 7, 11].includes(venH)) { start -= 1; signals.push(`Venus in ${venH}th house favours early relationship formation.`); }
  if ([2, 5, 7, 9, 11].includes(jupH)) { start -= 1; signals.push(`Jupiter in ${jupH}th house bestows marriage blessings.`); }
  if ([7, 8, 10, 12].includes(satH)) { start += 2; end += 3; signals.push(`Saturn in ${satH}th house — marriage is delayed but lasting.`); }
  if (["Venus", "Moon", "Jupiter"].includes(dasha.current)) signals.push(`Current ${dasha.current} Mahadasha is a favourable period for marriage.`);
  if (!signals.length) signals.push("Standard marriage timing based on planetary positions.");

  return { primary: `${start}–${end} years`, secondary: `${end + 1}–${end + 5} years`, signals };
}

// ── Personalised Remedies ────────────────────────────────

export function buildRemedies(
  lagna: RashiResult,
  nakName: string,
  dasha: DashaSummary,
  rows: Rows
): string[] {
  const satH = houseOf(rows, "Saturn");
  const marsH = houseOf(rows, "Mars");
  const rahuH = houseOf(rows, "Rahu");
  const moonH = houseOf(rows, "Moon");
  const moonDig = dignity(rows, "Moon");
  const jupH = houseOf(rows, "Jupiter");

  const remedies: string[] = [];

  // Lagna-lord mantra
  remedies.push(`Primary mantra: Recite "Om ${lagna.lord}aya Namah" 108 times at sunrise daily.`);

  // Nakshatra remedy
  const nakPuja: Record<string, string> = {
    Ashwini: "Feed white horses or donate to veterinary care", Rohini: "Donate white cloth or milk on Mondays",
    Mrigashira: "Offer green vegetables to cows on Wednesdays", Ardra: "Practice charity during rain, donate blue items",
    Pushya: "Donate yellow sweets and yellow flowers on Thursdays",
    Magha: "Honour ancestors (Pitru Tarpan) on Amavasya",
    Chitra: "Wear or donate red cloth on Tuesdays",
    Vishakha: "Light a lamp at a Durga temple on Fridays",
    Jyeshtha: "Recite Hanuman Chalisa on Tuesdays",
    Mula: "Feed root vegetables to cows on Saturdays",
    Shravana: "Recite Vishnu Sahasranama on Mondays",
    Dhanishta: "Play or listen to devotional music, donate musical instruments",
    Revati: "Feed fish or donate to those in need on Thursdays",
  };
  remedies.push(`Nakshatra remedy for ${nakName}: ${nakPuja[nakName] || `Light a lamp at your deity's temple on ${nakName} Nakshatra days monthly.`}`);

  // Dasha remedy
  const dashaMantras: Record<string, string> = {
    Sun: "Aditya Hridayam or Surya Mantra — recite at sunrise",
    Moon: "Om Som Somaya Namah — recite on Mondays, wear Pearl",
    Mars: "Om Kram Kreem Kroum Sah Bhaumaya Namah — recite Tuesdays, donate red lentils",
    Mercury: "Om Bum Budhaya Namah — recite Wednesdays, donate green items",
    Jupiter: "Om Brim Brihaspataye Namah — recite Thursdays, feed Brahmins",
    Venus: "Om Shum Shukraya Namah — recite Fridays, donate white items",
    Saturn: "Om Sham Shanicharaya Namah — recite Saturdays, donate sesame and black items",
    Rahu: "Om Bhram Bhreem Bhroum Sah Rahave Namah — Rahu Kavach on Saturdays",
    Ketu: "Om Shram Shreem Shroum Sah Ketave Namah — Ketu Kavach, feed dogs",
  };
  remedies.push(`Current ${dasha.current} Mahadasha remedy: ${dashaMantras[dasha.current] || "Recite Vishnu Sahasranama daily"}.`);

  // Saturn-specific
  if ([1, 6, 7, 8, 10].includes(satH))
    remedies.push("Saturn remedy: Feed crows on Saturdays, donate blue-black cloth to the needy, and light mustard oil lamps.");

  // Mars-specific
  if ([1, 2, 4, 7, 8, 12].includes(marsH))
    remedies.push("Mars (Mangal) remedy: Offer red flowers to Lord Hanuman on Tuesdays. Donate red lentils (masoor dal). Recite Mangal Stotra.");

  // Rahu-specific
  if ([1, 4, 7, 8].includes(rahuH))
    remedies.push("Rahu remedy: Donate radishes, mustard oil, or blue cloth on Saturdays. Recite Durga Saptashati. Wear Hessonite only after proper chart consultation.");

  // Weak Moon
  if (moonH && [6, 8, 12].includes(moonH) || moonDig === "Debilitated ⬇")
    remedies.push("Moon remedy: Offer water to Shiva Lingam on Mondays. Consume milk. Keep silver in the home. Donate white items.");

  // Universal
  remedies.push("Universal remedy: Daily Surya Namaskar at sunrise and water offering to the rising Sun purifies the energy field.");

  return remedies;
}

// ── Life Timeline ────────────────────────────────────────

export interface LifePhase { phase: string; positive: string; caution: string; solution: string; }

export function buildLifeTimeline(
  dasha: DashaSummary,
  rows: Rows,
  houses?: { house: number; signEnglish: string; lord: string }[]
): LifePhase[] {
  const tenthLord = houses ? houses[9].lord : "Saturn";
  const c10 = rows.find((r) => r.house === 10)?.body || tenthLord;
  const jupH = houseOf(rows, "Jupiter");
  const satH = houseOf(rows, "Saturn");
  const venH = houseOf(rows, "Venus");

  const careerPeak = KENDRA.includes(houseOf(rows, tenthLord)) ? "peak career recognition is naturally indicated" : "career breakthroughs come during 10th lord or Saturn Dasha";
  const partnerPhase = [5, 7, 9].includes(venH) ? "relationship and marriage prospects are strong" : "partnerships require effort and patience but bring lasting bonds";

  return [
    {
      phase: "Age 0–12",
      positive: `Foundation years shaped by ${rows.find((r) => r.house === 4)?.body || "Moon"} (4th house). Natural talents begin to emerge.`,
      caution: "Emotional conditioning in childhood has lasting impact.",
      solution: "Consistent positive reinforcement and early exposure to arts, sports or academics.",
    },
    {
      phase: "Age 13–20",
      positive: "Identity formation. Innate abilities surface. Educational direction becomes clear.",
      caution: "Rahu's influence in this period may create confusion about direction.",
      solution: "Choose one core strength to develop intensively. Avoid too many distractions.",
    },
    {
      phase: "Age 21–28",
      positive: `Career foundation via ${c10} influence. ${careerPeak}. Financial independence begins.`,
      caution: satH === 1 || satH === 10 ? "Saturn's placement may slow recognition despite ability." : "Financial pressure in early career phase.",
      solution: "Focus on skill mastery over job-hopping. Saturn rewards patient groundwork.",
    },
    {
      phase: "Age 29–36",
      positive: `Major life milestones — ${partnerPhase}. Jupiter transit over key houses amplifies growth.`,
      caution: "Overwork and responsibility accumulation can affect health and relationships.",
      solution: "Schedule rest proactively. Honour commitments but protect personal energy.",
    },
    {
      phase: "Age 37–48",
      positive: `Peak responsibility, authority and legacy building. ${dasha.next} Mahadasha begins in this window — plan accordingly.`,
      caution: "Decision fatigue and health concerns from sustained pressure.",
      solution: "Delegate effectively. Establish daily spiritual and physical routines before 40.",
    },
    {
      phase: "Age 49+",
      positive: `${jupH > 0 && TRIKONA.includes(jupH) ? "Jupiter's blessings support wisdom, spiritual authority and a respected legacy." : "Spiritual maturity and reflection bring deep peace."} ${dasha.next} Mahadasha offers renewed purpose.`,
      caution: "Resistance to lifestyle change and over-attachment to achievements.",
      solution: "Embrace giving, teaching and spiritual practice. Health discipline pays dividends.",
    },
  ];
}
