// Numerology calculator — pure math, no API

export interface NumerologyResult {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  lifePathMeaning: string;
  expressionMeaning: string;
}

function reduceToSingle(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split("").reduce((s, d) => s + Number(d), 0);
  }
  return n;
}

function nameToNumber(name: string): number {
  const map: Record<string, number> = {
    a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
    j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
    s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8,
  };
  const sum = name.toLowerCase().split("").reduce((s, c) => s + (map[c] || 0), 0);
  return reduceToSingle(sum);
}

function vowelsOnly(name: string): number {
  const vowels = "aeiou";
  const map: Record<string, number> = { a:1,e:5,i:9,o:6,u:3 };
  const sum = name.toLowerCase().split("").filter((c) => vowels.includes(c)).reduce((s, c) => s + (map[c] || 0), 0);
  return reduceToSingle(sum);
}

function consonantsOnly(name: string): number {
  const vowels = "aeiou";
  const map: Record<string, number> = {
    b:2,c:3,d:4,f:6,g:7,h:8,j:1,k:2,l:3,m:4,n:5,p:7,q:8,r:9,s:1,t:2,v:4,w:5,x:6,y:7,z:8,
  };
  const sum = name.toLowerCase().split("").filter((c) => !vowels.includes(c) && map[c]).reduce((s, c) => s + (map[c] || 0), 0);
  return reduceToSingle(sum);
}

const LIFE_PATH_MEANINGS: Record<number, string> = {
  1: "The Leader — You are independent, innovative, and destined to forge new paths. Self-reliance and ambition drive your success.",
  2: "The Diplomat — Cooperation, sensitivity, and harmony define your journey. You excel in partnerships and bringing people together.",
  3: "The Communicator — Creative expression, joy, and social magnetism are your gifts. Art, writing, or speaking are your natural channels.",
  4: "The Builder — Stability, hard work, and practical foundations are your strength. You create lasting structures and systems.",
  5: "The Adventurer — Freedom, change, and versatility define your path. You thrive on new experiences and dynamic environments.",
  6: "The Nurturer — Responsibility, love, and domestic harmony are central. Family and community service bring fulfillment.",
  7: "The Seeker — Spiritual depth, analysis, and inner wisdom guide you. Research, philosophy, and solitude fuel your growth.",
  8: "The Achiever — Power, material success, and executive ability mark your journey. Business acumen and authority come naturally.",
  9: "The Humanitarian — Compassion, universal love, and global consciousness define you. Serving others is your highest calling.",
  11: "Master Number — Spiritual insight, intuition, and inspiration at the highest level. You are a visionary and enlightened leader.",
  22: "Master Builder — The most powerful number. You can turn the grandest dreams into reality with practical wisdom.",
  33: "Master Teacher — The most spiritually advanced path. Universal love, selfless service, and cosmic consciousness.",
};

const EXPRESSION_MEANINGS: Record<number, string> = {
  1: "Natural born leader with original ideas and strong willpower.",
  2: "Sensitive peacemaker who excels in collaboration and diplomacy.",
  3: "Gifted communicator with artistic talent and optimistic energy.",
  4: "Dedicated worker who builds solid foundations and systems.",
  5: "Versatile explorer who adapts quickly and inspires change.",
  6: "Loving caretaker focused on beauty, harmony, and responsibility.",
  7: "Deep thinker drawn to mystery, research, and spiritual truth.",
  8: "Ambitious achiever with natural business sense and authority.",
  9: "Compassionate idealist working toward universal betterment.",
  11: "Intuitive visionary with extraordinary spiritual awareness.",
  22: "Master architect capable of manifesting grand visions.",
  33: "Selfless healer whose purpose is uplifting humanity.",
};

export function calculateNumerology(name: string, dob: string): NumerologyResult {
  const [y, m, d] = dob.split("-").map(Number);
  const lifePathRaw = String(y).split("").concat(String(m).split(""), String(d).split("")).reduce((s, c) => s + Number(c), 0);
  const lifePath = reduceToSingle(lifePathRaw);
  const expression = nameToNumber(name.replace(/\s/g, ""));
  const soulUrge = vowelsOnly(name.replace(/\s/g, ""));
  const personality = consonantsOnly(name.replace(/\s/g, ""));
  const birthday = reduceToSingle(d);

  return {
    lifePath,
    expression,
    soulUrge,
    personality,
    birthday,
    lifePathMeaning: LIFE_PATH_MEANINGS[lifePath] || LIFE_PATH_MEANINGS[lifePath > 9 ? 9 : lifePath] || "",
    expressionMeaning: EXPRESSION_MEANINGS[expression] || EXPRESSION_MEANINGS[expression > 9 ? 9 : expression] || "",
  };
}
