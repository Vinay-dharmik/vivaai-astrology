import { getPlanetHouseData, PLANETS_FOR_HOUSES, HOUSES, HOUSE_NAMES, HOUSE_TOPICS } from "@/lib/astrology/planetHouse";
import { seoMeta } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { InArticleAd } from "@/components/ui/AdBanner";
import Link from "next/link";
import { Metadata } from "next";

interface PageProps { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const planet of PLANETS_FOR_HOUSES) {
    for (const house of HOUSES) {
      params.push({ slug: `${planet.toLowerCase()}-in-${house}${house===1?"st":house===2?"nd":house===3?"rd":"th"}-house` });
    }
  }
  return params;
}

function parseSlug(slug: string): { planet: string; house: number } | null {
  const match = slug.match(/^(\w+)-in-(\d+)(?:st|nd|rd|th)-house$/);
  if (!match) return null;
  const planet = PLANETS_FOR_HOUSES.find(p => p.toLowerCase() === match[1]);
  const house = parseInt(match[2]);
  if (!planet || house < 1 || house > 12) return null;
  return { planet, house };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return seoMeta({ title: "Planet in House" });
  const data = getPlanetHouseData(parsed.planet, parsed.house);
  return seoMeta({
    title: `${data.title} — Effects & Remedies`,
    description: `${parsed.planet} in ${HOUSE_NAMES[parsed.house]} House effects on career, marriage, health & finance. Detailed Vedic astrology analysis with remedies, gemstones & predictions.`,
    path: `/astrology/${slug}`,
  });
}

export default async function PlanetHousePage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return <div className="section-container py-20 text-center text-white">Page not found</div>;

  const data = getPlanetHouseData(parsed.planet, parsed.house);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${data.title} — Effects, Career, Marriage & Remedies`,
    description: data.overview.substring(0, 200),
    author: { "@type": "Organization", name: "VivaAI Astrology" },
    publisher: { "@type": "Organization", name: "VivaAI Astrology" },
  };

  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb items={[{ label: "Astrology", href: "/calculator" }, { label: data.title }]} />

      <h1 className="font-sora font-extrabold text-2xl sm:text-3xl gold-text mb-2">{data.title}</h1>
      <p className="text-xs text-[var(--text-muted)] mb-6">Vedic Astrology Analysis • Effects & Remedies</p>

      <div className="glass-card-bright p-6 mb-6">
        <h2 className="text-sm font-semibold text-gold-200 uppercase tracking-wider mb-3">Overview</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{data.overview}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-gold-200 mb-2">💼 Career & Profession</h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{data.career}</p>
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-gold-200 mb-2">💍 Relationships</h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{data.relationships}</p>
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-gold-200 mb-2">🏥 Health</h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{data.health}</p>
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-gold-200 mb-2">✦ Strengths</h2>
          <ul className="space-y-1">
            {data.strengths.map((s, i) => <li key={i} className="text-xs text-[var(--text-secondary)] flex gap-1.5"><span className="text-mystic-green">✓</span>{s}</li>)}
          </ul>
        </div>
      </div>

      <InArticleAd />

      <div className="glass-card p-5 mb-4">
        <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">⚠ Challenges</h2>
        <ul className="space-y-1.5">
          {data.challenges.map((c, i) => <li key={i} className="text-xs text-[var(--text-secondary)] flex gap-2"><span className="text-red-400">•</span>{c}</li>)}
        </ul>
      </div>

      <div className="glass-card p-5 mb-6">
        <h2 className="text-sm font-semibold text-gold-200 uppercase tracking-wider mb-3">🔮 Remedies</h2>
        <ul className="space-y-1.5">
          {data.remedies.map((r, i) => <li key={i} className="text-xs text-[var(--text-secondary)] flex gap-2"><span className="text-gold-400">•</span>{r}</li>)}
        </ul>
      </div>

      <div className="flex justify-center mb-6">
        <ShareButtons title={data.title} text={`Learn about ${data.title} effects in Vedic astrology`} url={`https://vivaai.in/astrology/${slug}`} />
      </div>

      {/* Related pages — internal linking */}
      <div className="glass-card-bright p-5">
        <h2 className="text-sm font-semibold text-gold-200 mb-3">Related Placements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {HOUSES.filter(h => h !== parsed.house).slice(0, 6).map(h => (
            <Link key={h} href={`/astrology/${parsed.planet.toLowerCase()}-in-${h}${h===1?"st":h===2?"nd":h===3?"rd":"th"}-house`}
              className="text-xs text-[var(--text-secondary)] hover:text-gold-400 transition py-2 px-3 bg-white/[0.02] rounded-lg text-center">
              {parsed.planet} in {HOUSE_NAMES[h]}
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-8 glass-card p-6">
        <h2 className="font-sora font-bold text-lg gold-text mb-2">Check your planet placements</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">Generate your free Vedic Kundali to see all planetary positions.</p>
        <Link href="/kundali" className="gold-btn px-6 py-2 text-sm">Generate Free Kundali</Link>
      </div>

      <InArticleAd />
    </div>
  );
}
