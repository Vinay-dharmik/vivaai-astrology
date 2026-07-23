import { notFound } from "next/navigation";
import Link from "next/link";
import { seoMeta } from "@/lib/seo/metadata";
import { NAKSHATRAS } from "@/lib/astrology/constants";
import { getNakshatraProfileByIndex } from "@/lib/astrology/nakshatraProfiles";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

const slugToName = (slug: string) => NAKSHATRAS.find((n) => n.toLowerCase().replace(/\s+/g, "-") === slug) || "";

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const name = slugToName(slug);
  if (!name) return {};
  const idx = NAKSHATRAS.indexOf(name);
  const p = getNakshatraProfileByIndex(idx);
  return seoMeta({
    title: `${name} Nakshatra — Personality, Career & Compatibility`,
    description: `${name} Nakshatra (#${p.index}, ${p.span}). Ruled by ${p.lord}, deity ${p.deity}, ${p.gana} gana, ${p.yoni} yoni, ${p.nadi} nadi. Personality, career, marriage and health analysis with remedies.`,
    path: `/nakshatra/${slug}`,
  });
}

export function generateStaticParams() {
  return NAKSHATRAS.map((n) => ({ slug: n.toLowerCase().replace(/\s+/g, "-") }));
}

export default async function NakshatraDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const name = slugToName(slug);
  if (!name) notFound();

  const idx = NAKSHATRAS.indexOf(name);
  const desc = getNakshatraProfileByIndex(idx);
  const { lord, deity, symbol, gana, yoni: animal, nadi, rashi, span, bodyPart, remedy } = desc;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${name} Nakshatra — Personality, Career & Compatibility`,
    description: `${desc.personality.slice(0, 200)}`,
    author: { "@type": "Organization", name: "VivaAI Astrology", url: "https://vivaai.in" },
    publisher: { "@type": "Organization", name: "VivaAI Astrology", url: "https://vivaai.in" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://vivaai.in/nakshatra/${slug}` },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `Which planet rules ${name} Nakshatra?`, acceptedAnswer: { "@type": "Answer", text: `${name} Nakshatra is ruled by ${lord}, with ${deity} as its presiding deity.` } },
      { "@type": "Question", name: `What careers suit ${name} Nakshatra natives?`, acceptedAnswer: { "@type": "Answer", text: desc.career } },
      { "@type": "Question", name: `What is the Gana of ${name} Nakshatra?`, acceptedAnswer: { "@type": "Answer", text: `${name} belongs to the ${gana} Gana, with ${animal} as its Yoni and ${nadi} Nadi. It spans ${span}.` } },
    ],
  };

  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumb items={[{ label: "Nakshatra", href: "/nakshatra" }, { label: `${name} Nakshatra` }]} />
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">⭐</div>
        <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-1">Nakshatra #{idx + 1}</p>
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-2">{name} Nakshatra</h1>
        <p className="text-sm text-[var(--text-muted)]">{rashi} • Lord: {lord} • Deity: {deity}</p>
      </div>

      <div className="glass-card-bright p-6 sm:p-8 space-y-6">
        {/* Quick facts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <Fact label="Ruling Planet" value={lord} />
          <Fact label="Deity" value={deity} />
          <Fact label="Symbol" value={symbol} />
          <Fact label="Gana" value={gana} />
          <Fact label="Animal" value={animal} />
          <Fact label="Rashi" value={rashi} />
          <Fact label="Nadi" value={nadi} />
          <Fact label="Span" value={span} />
        </div>

        <Sec title="🧠 Personality & Nature">{desc.personality}</Sec>
        <Sec title="💼 Career & Profession">{desc.career}</Sec>
        <Sec title="❤️ Relationships & Marriage">{desc.relationship}</Sec>
        <Sec title="🏥 Health">{desc.health}</Sec>
        <div>
          <h2 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-2">🔮 Remedies</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{remedy}</p>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-2">
            In the Kalapurusha scheme {name} governs {bodyPart.toLowerCase()}, which is where this
            Nakshatra&apos;s afflictions most often show physically.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-2">✦ Strengths</h3>
            <ul className="space-y-1">{desc.strengths.map((s) => <li key={s} className="text-sm text-[var(--text-secondary)] flex gap-2"><span className="text-mystic-green">✓</span>{s}</li>)}</ul>
          </div>
          <div>
            <h3 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-2">⚠ Challenges</h3>
            <ul className="space-y-1">{desc.weaknesses.map((w) => <li key={w} className="text-sm text-[var(--text-secondary)] flex gap-2"><span className="text-red-400">•</span>{w}</li>)}</ul>
          </div>
        </div>
      </div>

      {/* Compatibility cross-links — internal linking + high user intent */}
      <div className="glass-card-bright p-5 mt-6">
        <h2 className="text-sm font-semibold text-gold-200 mb-3">{name} Nakshatra Compatibility</h2>
        <p className="text-xs text-[var(--text-muted)] mb-3">Check how {name} matches with other Nakshatras for marriage:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {NAKSHATRAS.filter((n) => n !== name).slice(0, 6).map((other) => {
            const otherSlug = other.toLowerCase().replace(/\s+/g, "-");
            return (
              <Link key={other} href={`/nakshatra-compatibility/${slug}-and-${otherSlug}`}
                className="text-xs text-center py-2 px-2 bg-white/[0.02] rounded-lg text-[var(--text-secondary)] hover:text-gold-400 hover:bg-white/[0.04] transition">
                {name} & {other}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-6">
        <Link href="/nakshatra" className="text-sm text-gold-400 hover:underline">← All Nakshatras</Link>
        <Link href="/kundali" className="gold-btn text-sm px-6 py-2">Find Your Nakshatra</Link>
        <Link href="/nakshatra-compatibility" className="glass-card text-sm px-6 py-2 text-gold-200 hover:text-gold-400 transition">All Compatibility</Link>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[rgba(8,6,14,0.5)] border border-[var(--border)] rounded-lg p-2.5 text-center">
      <div className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider">{label}</div>
      <div className="text-xs font-semibold text-white mt-1">{value}</div>
    </div>
  );
}

function Sec({ title, children }: { title: string; children: string }) {
  return (
    <div>
      <h2 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-2">{title}</h2>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{children}</p>
    </div>
  );
}
