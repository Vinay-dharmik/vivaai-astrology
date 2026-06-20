import Link from "next/link";
import { seoMeta } from "@/lib/seo/metadata";
import { NAKSHATRAS, NAK_LORDS } from "@/lib/astrology/constants";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InArticleAd } from "@/components/ui/AdBanner";
import { RelatedTools } from "@/components/ui/RelatedTools";

export const metadata = seoMeta({
  title: "27 Nakshatras — Complete Vedic Star Guide & Personality Traits",
  description: "Explore all 27 Nakshatras with detailed personality traits, deity, ruling planet, compatibility & career guidance for each birth star. The complete Vedic lunar mansion guide.",
  path: "/nakshatra",
  keywords: [
    "27 nakshatras", "nakshatra list", "birth star", "lunar mansion",
    "nakshatra personality", "nakshatra compatibility", "ashwini nakshatra",
    "rohini nakshatra", "nakshatra finder", "birth nakshatra calculator",
  ],
});

export default function NakshatraPage() {
  return (
    <div className="section-container py-12">
      <Breadcrumb items={[{ label: "27 Nakshatras" }]} />
      <div className="text-center mb-10">
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">27 Nakshatras</h1>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">
          The 27 lunar mansions of Vedic astrology. Discover your Nakshatra&apos;s personality, strengths, and life path.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
        {NAKSHATRAS.map((nak, i) => (
          <Link key={nak} href={`/nakshatra/${nak.toLowerCase().replace(/\s+/g, "-")}`}
            className="glass-card p-4 text-center group hover:border-gold-400/40 transition-all hover:-translate-y-1">
            <div className="text-2xl mb-1">⭐</div>
            <h2 className="font-semibold text-sm text-white group-hover:text-gold-400 transition">{nak}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">Lord: {NAK_LORDS[i]}</p>
            <p className="text-xs text-gold-400/60">#{i + 1}</p>
          </Link>
        ))}
      </div>
      <InArticleAd />

      {/* Educational Content */}
      <div className="max-w-3xl mx-auto mt-16 space-y-12">
        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">What Are the 27 Nakshatras in Vedic Astrology?</h2>
          <div className="glass-card-bright p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              The <strong className="text-white">Nakshatras</strong> (also called <em>lunar mansions</em> or <em>birth stars</em>) are 27 segments of the sky that the Moon traverses during its monthly orbit around the Earth. Each Nakshatra spans exactly <strong className="text-gold-200">13 degrees and 20 minutes</strong> of the 360-degree zodiac, and the Moon spends approximately one day in each Nakshatra.
            </p>
            <p>
              The Nakshatra system is one of the oldest and most refined aspects of Vedic astrology, predating even the 12-sign zodiac system. References to Nakshatras appear in the <em>Rig Veda</em>, one of the world&apos;s oldest texts (circa 1500 BCE), where they were used for tracking the Moon&apos;s position and timing agricultural and religious activities.
            </p>
            <p>
              Your <strong className="text-white">birth Nakshatra</strong> — the Nakshatra where the Moon was positioned at your exact moment of birth — is considered one of the most significant factors in Vedic astrology. It determines your <strong className="text-gold-200">Vimshottari Dasha starting period</strong> (the planetary cycle that governs the timing of life events), your core personality traits, emotional patterns, innate talents, and compatibility with others.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">How Nakshatras Influence Your Life</h2>
          <div className="glass-card-bright p-6 sm:p-8 text-sm text-[var(--text-secondary)] leading-relaxed">
            <div className="space-y-4">
              <div className="bg-white/[0.03] rounded-lg p-4">
                <h3 className="font-semibold text-gold-200 mb-1.5">Personality & Temperament</h3>
                <p className="text-xs leading-relaxed">Each Nakshatra has a presiding deity, animal symbol, and Gana (temperament type: Deva, Manushya, or Rakshasa). These shape your core personality far more specifically than your zodiac sign alone. For example, Rohini Nakshatra natives (ruled by Moon, deity Brahma) are creative, attractive, and materially oriented, while Moola Nakshatra natives (ruled by Ketu, deity Nirriti) are transformative, research-oriented, and spiritually inclined.</p>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-4">
                <h3 className="font-semibold text-gold-200 mb-1.5">Career & Life Purpose</h3>
                <p className="text-xs leading-relaxed">The ruling planet and deity of your Nakshatra indicate career aptitudes. Sun-ruled Nakshatras (Krittika, U. Phalguni, U. Ashadha) favor leadership and government roles. Mercury-ruled Nakshatras (Ashlesha, Jyeshtha, Revati) excel in business, communication, and intellectual pursuits.</p>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-4">
                <h3 className="font-semibold text-gold-200 mb-1.5">Marriage Compatibility</h3>
                <p className="text-xs leading-relaxed">Nakshatra compatibility is the foundation of Vedic marriage matching. The Ashtakoot system evaluates Gana (temperament), Yoni (physical compatibility), Nadi (health), and other factors based on Nakshatra positions. Check your <Link href="/nakshatra-compatibility" className="text-gold-400 hover:underline">Nakshatra compatibility</Link> for all 729 combinations.</p>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-4">
                <h3 className="font-semibold text-gold-200 mb-1.5">The Pada System</h3>
                <p className="text-xs leading-relaxed">Each Nakshatra is further divided into 4 Padas (quarters) of 3°20&apos; each. The Pada adds an additional layer of specificity — it determines the Navamsa (D-9) chart placement and refines predictions. Two people with the same Nakshatra but different Padas may have noticeably different personality expressions.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">Finding Your Birth Nakshatra</h2>
          <div className="glass-card-bright p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              To identify your Nakshatra, you need your exact <strong className="text-white">date, time, and place of birth</strong>. The Moon&apos;s position is calculated using astronomical algorithms, and the Nakshatra is determined by which 13°20&apos; segment the Moon occupies. Since the Moon changes Nakshatras approximately every 24 hours, birth time precision is important.
            </p>
            <p>
              <Link href="/kundali" className="text-gold-400 hover:underline">Generate your free Kundali</Link> to discover your birth Nakshatra, its ruling planet, deity, personality traits, and how it influences your Vimshottari Dasha timeline.
            </p>
          </div>
        </section>

        <div className="pb-4">
          <RelatedTools currentPath="/nakshatra" />
        </div>
      </div>
    </div>
  );
}
