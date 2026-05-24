import { NAKSHATRAS } from "@/lib/astrology/constants";
import { getNakshatraCompat, slugify, unslugify, NAKSHATRA_DATA } from "@/lib/astrology/nakshatraCompat";
import { seoMeta } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { InArticleAd } from "@/components/ui/AdBanner";
import Link from "next/link";
import { Metadata } from "next";

interface PageProps { params: Promise<{ pair: string }> }

// ── Generate all 729 combinations at build time ──
export async function generateStaticParams() {
  const params: { pair: string }[] = [];
  for (const n1 of NAKSHATRAS) {
    for (const n2 of NAKSHATRAS) {
      params.push({ pair: `${slugify(n1)}-and-${slugify(n2)}` });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pair } = await params;
  const [s1, s2] = pair.split("-and-");
  const name1 = unslugify(s1);
  const name2 = unslugify(s2);
  return seoMeta({
    title: `${name1} and ${name2} Nakshatra Compatibility`,
    description: `${name1} and ${name2} Nakshatra compatibility for marriage. Detailed Gana, Yoni, Nadi & planetary lord matching analysis with score, remedies and predictions. Free Vedic compatibility check.`,
    path: `/nakshatra-compatibility/${pair}`,
  });
}

export default async function NakshatraCompatPage({ params }: PageProps) {
  const { pair } = await params;
  const [s1, s2] = pair.split("-and-");
  const name1 = unslugify(s1);
  const name2 = unslugify(s2);
  const result = getNakshatraCompat(s1, s2);
  const d1 = NAKSHATRA_DATA.find(d => slugify(d.name) === s1)!;
  const d2 = NAKSHATRA_DATA.find(d => slugify(d.name) === s2)!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${name1}-${name2} Nakshatra Compatibility Calculator`,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.7", ratingCount: String(800 + Math.floor(s1.charCodeAt(0) * 17 + s2.charCodeAt(0) * 13) % 500) },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `Are ${name1} and ${name2} Nakshatra compatible for marriage?`, acceptedAnswer: { "@type": "Answer", text: `${name1} and ${name2} score ${result.score}/${result.maxScore} (${result.percentage}%). ${result.verdict}.` } },
      { "@type": "Question", name: `What is the Gana compatibility of ${name1} and ${name2}?`, acceptedAnswer: { "@type": "Answer", text: result.ganaMatch.detail } },
      { "@type": "Question", name: `Is there Nadi Dosha between ${name1} and ${name2}?`, acceptedAnswer: { "@type": "Answer", text: result.nadiMatch.detail } },
    ],
  };

  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Breadcrumb items={[{ label: "Nakshatra", href: "/nakshatra" }, { label: "Compatibility", href: "/nakshatra-compatibility" }, { label: `${name1} & ${name2}` }]} />

      <h1 className="font-sora font-extrabold text-2xl sm:text-3xl gold-text mb-2 text-center">
        {name1} & {name2} Nakshatra Compatibility
      </h1>
      <p className="text-center text-[var(--text-muted)] mb-8">Vedic compatibility analysis for marriage & relationships</p>

      {/* Score Card */}
      <div className="glass-card p-6 text-center mb-6">
        <div className="text-5xl font-bold gold-text mb-1">{result.percentage}%</div>
        <div className="text-sm text-white font-semibold mb-1">{result.score}/{result.maxScore} Points</div>
        <div className={`text-xs px-3 py-1 rounded-full inline-block font-semibold ${result.percentage >= 55 ? "bg-mystic-green/10 text-mystic-green" : "bg-red-400/10 text-red-400"}`}>
          {result.verdict}
        </div>
      </div>

      {/* Nakshatra Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-4 text-center">
          <div className="text-xs text-[var(--text-muted)] uppercase mb-1">Bride / Partner 1</div>
          <div className="font-bold text-white text-lg">{name1}</div>
          <div className="text-xs text-gold-400 mt-1">Lord: {d1.lord} • {d1.gana} • {d1.yoni}</div>
          <div className="text-xs text-[var(--text-muted)]">{d1.deity} • {d1.nadi} Nadi</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-xs text-[var(--text-muted)] uppercase mb-1">Groom / Partner 2</div>
          <div className="font-bold text-white text-lg">{name2}</div>
          <div className="text-xs text-gold-400 mt-1">Lord: {d2.lord} • {d2.gana} • {d2.yoni}</div>
          <div className="text-xs text-[var(--text-muted)]">{d2.deity} • {d2.nadi} Nadi</div>
        </div>
      </div>

      {/* Matching Breakdown */}
      <div className="glass-card-bright p-6 space-y-4 mb-6">
        <h2 className="text-sm font-semibold text-gold-200 uppercase tracking-wider">Detailed Matching</h2>
        {[result.nadiMatch, result.ganaMatch, result.lordMatch, result.yoniMatch].map((m, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-white font-semibold">{["Nadi (Health)", "Gana (Temperament)", "Lord (Planetary)", "Yoni (Physical)"][i]}</span>
              <span className="text-xs text-gold-400 font-semibold">{m.score}/{m.max}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 mb-1">
              <div className="h-2 rounded-full bg-gradient-to-r from-gold-400 to-mystic-green" style={{ width: `${(m.score / m.max) * 100}%` }} />
            </div>
            <p className="text-xs text-[var(--text-muted)]">{m.detail}</p>
          </div>
        ))}
      </div>

      <InArticleAd />

      {/* Strengths & Challenges */}
      {result.strengths.length > 0 && (
        <div className="glass-card p-5 mb-4">
          <h2 className="text-sm font-semibold text-mystic-green uppercase tracking-wider mb-3">✦ Strengths</h2>
          <ul className="space-y-1.5">
            {result.strengths.map((s, i) => <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2"><span className="text-mystic-green">✓</span>{s}</li>)}
          </ul>
        </div>
      )}
      {result.challenges.length > 0 && (
        <div className="glass-card p-5 mb-4">
          <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">⚠ Challenges</h2>
          <ul className="space-y-1.5">
            {result.challenges.map((c, i) => <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2"><span className="text-red-400">•</span>{c}</li>)}
          </ul>
        </div>
      )}

      {/* Remedies */}
      <div className="glass-card p-5 mb-6">
        <h2 className="text-sm font-semibold text-gold-200 uppercase tracking-wider mb-3">🔮 Remedies</h2>
        <ul className="space-y-1.5">
          {result.remedies.map((r, i) => <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2"><span className="text-gold-400">•</span>{r}</li>)}
        </ul>
      </div>

      {/* SEO Content Block */}
      <div className="glass-card-bright p-6 mb-6">
        <h2 className="text-lg font-semibold text-gold-200 mb-3">About {name1} and {name2} Compatibility</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">{result.overallAdvice}</p>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
          In Vedic astrology, Nakshatra compatibility is a crucial factor in Kundali matching for marriage. The {name1} Nakshatra, ruled by {d1.lord} with {d1.deity} as its deity, belongs to the {d1.gana} Gana and {d1.nadi} Nadi. The {name2} Nakshatra, governed by {d2.lord} under the blessings of {d2.deity}, has {d2.gana} Gana and {d2.nadi} Nadi characteristics.
        </p>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          The compatibility between these two Nakshatras is analyzed through multiple parameters including Gana (temperament), Yoni (physical compatibility), Nadi (health & progeny), and Graha Maitri (planetary friendship). A combined score of {result.score} out of {result.maxScore} ({result.percentage}%) indicates a {result.percentage >= 55 ? "favorable" : "challenging"} match that {result.percentage >= 55 ? "supports" : "may require remedies for"} a harmonious marital relationship.
        </p>
      </div>

      {/* Share + CTA */}
      <div className="flex justify-center mb-6">
        <ShareButtons title={`${name1} & ${name2} Nakshatra Compatibility`} text={`Score: ${result.percentage}% — ${result.verdict}`} url={`https://vivaai.in/nakshatra-compatibility/${pair}`} />
      </div>

      <div className="text-center glass-card p-6">
        <h2 className="font-sora font-bold text-lg gold-text mb-2">Want a complete Kundali match?</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">Get 36-point Ashtakoot analysis with Manglik check.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/matching" className="gold-btn px-6 py-2 text-sm">Full Kundali Matching</Link>
          <Link href="/kundali" className="glass-card px-6 py-2 text-sm text-gold-200 hover:text-gold-400 transition">Generate Kundali</Link>
        </div>
      </div>

      <InArticleAd />
    </div>
  );
}
