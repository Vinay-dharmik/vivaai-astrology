import { notFound } from "next/navigation";
import Link from "next/link";
import { ZODIAC_INFO } from "@/lib/astrology/constants";
import { seoMeta } from "@/lib/seo/metadata";

const SIGNS = Object.keys(ZODIAC_INFO);
const SYMBOLS: Record<string, string> = {
  aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋", leo: "♌", virgo: "♍",
  libra: "♎", scorpio: "♏", sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓",
};

// Compatibility data — element-based scoring
const ELEMENT: Record<string, string> = {
  aries: "Fire", taurus: "Earth", gemini: "Air", cancer: "Water", leo: "Fire", virgo: "Earth",
  libra: "Air", scorpio: "Water", sagittarius: "Fire", capricorn: "Earth", aquarius: "Air", pisces: "Water",
};

function getScore(s1: string, s2: string): number {
  if (s1 === s2) return 78;
  const e1 = ELEMENT[s1], e2 = ELEMENT[s2];
  if (e1 === e2) return 85;
  const good: Record<string, string> = { Fire: "Air", Air: "Fire", Earth: "Water", Water: "Earth" };
  if (good[e1] === e2) return 82;
  const neutral: Record<string, string[]> = { Fire: ["Earth"], Earth: ["Air"], Air: ["Water"], Water: ["Fire"] };
  if (neutral[e1]?.includes(e2)) return 55;
  return 45;
}

function getAnalysis(s1: string, s2: string): { love: string; friendship: string; work: string; challenges: string } {
  const e1 = ELEMENT[s1], e2 = ELEMENT[s2];
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  if (e1 === e2) return {
    love: `${cap(s1)} and ${cap(s2)} share the same ${e1} element, creating a natural understanding and deep resonance. This relationship often feels like coming home — you instinctively understand each other's needs, motivations, and communication style. The connection is strong and requires minimal effort to maintain.`,
    friendship: `As same-element signs, your friendship is built on shared values and similar worldviews. You enjoy similar activities and have a natural rhythm together. This is one of those friendships that picks up right where it left off, no matter how long you've been apart.`,
    work: `Professional collaboration flows naturally between these signs. You share similar work ethics and approaches to problem-solving. Your combined ${e1.toLowerCase()} energy creates powerful momentum in joint projects.`,
    challenges: `The main challenge is that too much similarity can lead to stagnation. You may reinforce each other's weaknesses or blind spots. Actively seeking different perspectives helps maintain growth and balance.`,
  };

  const compatible = (e1 === "Fire" && e2 === "Air") || (e1 === "Air" && e2 === "Fire") || (e1 === "Earth" && e2 === "Water") || (e1 === "Water" && e2 === "Earth");
  if (compatible) return {
    love: `${cap(s1)} (${e1}) and ${cap(s2)} (${e2}) form a naturally complementary pair. ${e1} and ${e2} elements enhance each other beautifully — one provides fuel while the other provides direction. This creates a dynamic and balanced romantic connection with excellent long-term potential.`,
    friendship: `This friendship is energizing and growth-oriented. You bring out the best in each other by offering what the other lacks. ${cap(s1)} provides ${e1 === "Fire" || e1 === "Air" ? "enthusiasm and ideas" : "stability and depth"}, while ${cap(s2)} contributes ${e2 === "Fire" || e2 === "Air" ? "inspiration and vision" : "grounding and emotional depth"}.`,
    work: `Professionally, this is a power combination. The complementary energies mean you cover each other's weaknesses naturally. One excels at planning while the other at execution, creating a well-rounded team.`,
    challenges: `Different pacing can cause friction — ${e1} signs tend to be ${e1 === "Fire" || e1 === "Air" ? "fast-moving" : "deliberate"}, while ${e2} signs are more ${e2 === "Fire" || e2 === "Air" ? "spontaneous" : "cautious"}. Learning to appreciate each other's rhythm is key to harmony.`,
  };

  return {
    love: `${cap(s1)} (${e1}) and ${cap(s2)} (${e2}) represent a challenging but potentially transformative pairing. The tension between these elements creates intense attraction but also friction. Success requires conscious effort, mutual respect, and willingness to learn from your differences.`,
    friendship: `This friendship may start slowly but can become deeply meaningful once trust is established. You offer each other radically different perspectives that promote personal growth. The key is patience and genuine curiosity about each other's world.`,
    work: `Professional partnerships between these signs require clear communication and defined roles. Your different approaches can either clash or complement beautifully — it depends on mutual respect and shared goals.`,
    challenges: `Fundamental differences in approach and values require ongoing negotiation. ${cap(s1)} may find ${cap(s2)} too ${e2 === "Fire" || e2 === "Air" ? "restless" : "rigid"}, while ${cap(s2)} may see ${cap(s1)} as too ${e1 === "Fire" || e1 === "Air" ? "impulsive" : "slow"}. Compromise and acceptance are essential.`,
  };
}

interface PageProps { params: Promise<{ sign: string }> }

export async function generateMetadata({ params }: PageProps) {
  const { sign } = await params;
  if (!ZODIAC_INFO[sign]) return {};
  const cap = sign.charAt(0).toUpperCase() + sign.slice(1);
  return seoMeta({
    title: `${cap} Compatibility — Love & Marriage Match`,
    description: `${cap} zodiac compatibility with all 12 signs. Detailed love, friendship & marriage compatibility analysis for ${cap}.`,
    path: `/compatibility/${sign}`,
  });
}

export function generateStaticParams() {
  return SIGNS.map((sign) => ({ sign }));
}

export default async function SignCompatPage({ params }: PageProps) {
  const { sign } = await params;
  if (!ZODIAC_INFO[sign]) notFound();
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="section-container py-12 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">{SYMBOLS[sign]}</div>
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text capitalize mb-2">
          {sign} Compatibility
        </h1>
        <p className="text-[var(--text-muted)]">{ZODIAC_INFO[sign].dates} • Ruled by {ZODIAC_INFO[sign].ruling}</p>
      </div>

      <div className="space-y-6">
        {SIGNS.map((other) => {
          const score = getScore(sign, other);
          const analysis = getAnalysis(sign, other);
          const color = score >= 75 ? "text-mystic-green" : score >= 55 ? "text-gold-400" : "text-red-400";
          const barColor = score >= 75 ? "bg-mystic-green" : score >= 55 ? "bg-gold-400" : "bg-red-400";

          return (
            <div key={other} className="glass-card p-5 sm:p-6" id={`${sign}-${other}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-sora font-bold text-lg text-white">
                  {SYMBOLS[sign]} {cap(sign)} × {SYMBOLS[other]} {cap(other)}
                </h2>
                <span className={`text-2xl font-bold ${color}`}>{score}%</span>
              </div>

              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-5">
                <div className={`h-full ${barColor} rounded-full`} style={{ width: `${score}%` }} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-2">❤️ Love & Romance</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">{analysis.love}</p>
                </div>
                <div>
                  <h3 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-2">🤝 Friendship</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">{analysis.friendship}</p>
                </div>
                <div>
                  <h3 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-2">💼 Work & Business</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">{analysis.work}</p>
                </div>
                <div>
                  <h3 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-2">⚠️ Challenges</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">{analysis.challenges}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Link href="/compatibility" className="text-sm text-gold-400 hover:underline">← All Signs</Link>
        <Link href="/matching" className="gold-btn text-sm px-6 py-2">Detailed Kundali Matching</Link>
      </div>
    </div>
  );
}
