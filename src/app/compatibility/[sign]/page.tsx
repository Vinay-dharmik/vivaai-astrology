import { notFound } from "next/navigation";
import Link from "next/link";
import { ZODIAC_INFO } from "@/lib/astrology/constants";
import { seoMeta } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getSignCompat } from "@/lib/astrology/signCompat";

const SIGNS = Object.keys(ZODIAC_INFO);
const SYMBOLS: Record<string, string> = {
  aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋", leo: "♌", virgo: "♍",
  libra: "♎", scorpio: "♏", sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓",
};

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

  // Best/worst matches for FAQ schema
  const bestMatch = SIGNS.filter((o) => o !== sign).sort(
    (a, b) => getSignCompat(sign, b).score - getSignCompat(sign, a).score
  )[0];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `Which sign is most compatible with ${cap(sign)}?`, acceptedAnswer: { "@type": "Answer", text: `${cap(sign)} is most compatible with ${cap(bestMatch)} (${getSignCompat(sign, bestMatch).score}%). Their Bhakoot axis is ${getSignCompat(sign, bestMatch).bhakoot.axis} and the sign lords are ${getSignCompat(sign, bestMatch).maitri.toLowerCase()}.` } },
      { "@type": "Question", name: `Who should ${cap(sign)} marry?`, acceptedAnswer: { "@type": "Answer", text: `For marriage, ${cap(sign)} pairs best with signs of compatible elements. For an accurate match based on birth charts, use Vedic Kundali matching rather than sun sign alone.` } },
    ],
  };

  return (
    <div className="section-container py-12 max-w-4xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumb items={[{ label: "Compatibility", href: "/compatibility" }, { label: `${cap(sign)} Compatibility` }]} />
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">{SYMBOLS[sign]}</div>
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text capitalize mb-2">
          {sign} Compatibility
        </h1>
        <p className="text-[var(--text-muted)]">{ZODIAC_INFO[sign].dates} • Ruled by {ZODIAC_INFO[sign].ruling}</p>
      </div>

      <div className="space-y-6">
        {SIGNS.map((other) => {
          const analysis = getSignCompat(sign, other);
          const score = analysis.score;
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

              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                <div className={`h-full ${barColor} rounded-full`} style={{ width: `${score}%` }} />
              </div>

              <div className="flex flex-wrap gap-2 mb-5 text-[0.7rem]">
                <span className={`px-2 py-1 rounded-full ${analysis.bhakoot.dosha ? "bg-red-400/10 text-red-400" : "bg-mystic-green/10 text-mystic-green"}`}>
                  Bhakoot {analysis.bhakoot.axis} — {analysis.bhakoot.points}/7
                </span>
                <span className="px-2 py-1 rounded-full bg-gold-400/10 text-gold-200">
                  Graha Maitri: {analysis.lordA} &amp; {analysis.lordB} — {analysis.maitri}
                </span>
                <span className="px-2 py-1 rounded-full bg-white/5 text-[var(--text-muted)]">{analysis.verdict}</span>
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
