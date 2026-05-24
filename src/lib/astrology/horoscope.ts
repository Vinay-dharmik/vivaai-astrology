// Enhanced local horoscope generator — unique daily content per sign
// Uses deterministic seeding so same day = same horoscope

const GENERAL = [
  "The cosmic alignment today favors bold initiatives. Your energy levels are high, and it's a perfect time to start new projects or take decisive action. The planetary configuration suggests breakthroughs in long-pending matters.",
  "Planetary energies bring clarity to decisions you've been postponing. Trust your inner guidance system today — it's more aligned with cosmic truth than usual. Important revelations may come through unexpected channels.",
  "Today's stellar configuration supports creative expression and artistic endeavors. Your imagination is heightened, and ideas that seemed abstract may suddenly crystallize into actionable plans. Collaboration brings extra magic.",
  "The celestial arrangement encourages deep introspection and self-discovery. Take time for meditation or journaling. Hidden aspects of situations may reveal themselves, giving you a strategic advantage in personal and professional matters.",
  "Cosmic vibrations are particularly strong for manifesting your goals today. The alignment between inner planets creates a window of opportunity. Focus your intentions clearly and take concrete steps toward your dreams.",
  "The universe aligns to support your authentic path of growth. Relationships receive cosmic blessings, and financial matters may see positive movement. Stay grounded while allowing flexibility in your approach.",
  "Planetary movements create powerful opportunities for transformation and renewal. Old patterns may dissolve naturally, making space for fresh perspectives. Embrace change as a gateway to your next level of evolution.",
];

const CAREER = [
  "Focus on collaborative projects for maximum career impact today. Team synergy is strong, and joint efforts yield remarkable results.",
  "A leadership opportunity may present itself unexpectedly. Be ready to step up and showcase your capabilities to decision-makers.",
  "Financial decisions at work require extra careful analysis today. Review contracts and proposals thoroughly before committing.",
  "Networking pays significant dividends today. Reach out to former colleagues or attend professional events for valuable connections.",
  "Your creative ideas will gain unexpected traction with management. Present innovative solutions with confidence and data backing.",
  "Patience in negotiations leads to considerably better outcomes. Don't rush agreements — time is on your side today.",
  "A mentor figure or senior colleague may offer guidance that reshapes your career trajectory. Be receptive to wisdom from experience.",
];

const LOVE = [
  "Express feelings openly today — vulnerability builds deeper emotional connections. Your partner will appreciate authenticity and courage.",
  "Quality time with loved ones strengthens emotional bonds significantly. Create memorable shared experiences through simple, heartfelt activities.",
  "A heartfelt conversation has the power to resolve lingering misunderstandings. Choose words carefully and listen with empathy and patience.",
  "Romance is beautifully highlighted in your chart today. Plan something special for your partner or be open to new romantic possibilities.",
  "Focus on understanding your partner's perspective and love language today. Mutual respect creates the foundation for lasting happiness.",
  "Self-love and personal care practices enhance your attractiveness and inner confidence. You can only give love fully when you love yourself first.",
  "Family relationships benefit from extra attention and nurturing today. Resolve old conflicts with compassion and create healing spaces.",
];

const HEALTH = [
  "Morning meditation or mindfulness practice brings exceptional mental clarity and emotional balance. Even 10 minutes makes a profound difference today.",
  "Physical activity significantly boosts your energy and mood today. Choose movement that brings you joy — dancing, walking in nature, or yoga.",
  "Pay close attention to your nutritional choices today. What you eat directly affects your mental clarity and emotional equilibrium.",
  "Rest and recovery are essential for maintaining your momentum. Don't push beyond healthy limits — sustainable energy beats burnout every time.",
  "Outdoor activities and nature connection restore your mental and emotional balance powerfully today. Fresh air is medicine for the soul.",
  "Hydration and mindful, conscious eating improve your vitality noticeably. Your body is particularly responsive to nurturing care today.",
  "Yoga, stretching, or bodywork helps release accumulated physical tension and emotional stress. Your body holds wisdom — listen to its signals.",
];

const FINANCE = [
  "Conservative financial decisions protect your long-term wealth today. Avoid impulsive purchases and focus on building your savings foundation.",
  "An unexpected financial opportunity may surface. Evaluate it carefully but don't dismiss it — sometimes fortune favors the prepared mind.",
  "Review your investment portfolio and financial goals today. Small adjustments now can lead to significant returns in the coming months.",
  "Spending on self-development, education, or health is well-starred today. Investments in yourself always yield the highest returns.",
  "Financial partnerships or joint ventures show positive potential. Ensure clear agreements and mutual understanding before proceeding.",
  "Today favors paying off debts or clearing financial obligations. The energy supports liberation from financial burdens and fresh starts.",
  "Multiple income streams deserve attention today. Your entrepreneurial instincts are sharp — explore side projects or passive income opportunities.",
];

function seedHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number, offset: number = 0): T {
  return arr[((seed >> offset) + offset) % arr.length];
}

export function generateDailyHoroscope(sign: string, date: Date = new Date()) {
  const dateStr = date.toISOString().split("T")[0];
  const seed = seedHash(`${sign}-${dateStr}`);

  const colors = ["Gold", "Silver", "Royal Blue", "Emerald Green", "Purple", "White", "Coral", "Turquoise", "Rose Pink", "Amber"];
  const moods = ["Energetic", "Reflective", "Optimistic", "Focused", "Creative", "Calm", "Adventurous", "Determined", "Inspired", "Grounded"];

  return {
    general: pick(GENERAL, seed, 0),
    career: pick(CAREER, seed, 2),
    love: pick(LOVE, seed, 4),
    health: pick(HEALTH, seed, 6),
    finance: pick(FINANCE, seed, 8),
    luckyNumber: (seed % 9) + 1,
    luckyColor: pick(colors, seed, 3),
    mood: pick(moods, seed, 5),
    intensity: (seed % 25) + 75, // 75-99%
    loveScore: (seed % 20) + 75,
    careerScore: ((seed >> 2) % 20) + 75,
    healthScore: ((seed >> 4) % 20) + 75,
    financeScore: ((seed >> 6) % 20) + 75,
  };
}
