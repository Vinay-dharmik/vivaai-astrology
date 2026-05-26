import { seoMeta } from "@/lib/seo/metadata";
import { NAKSHATRAS } from "@/lib/astrology/constants";
import { slugify } from "@/lib/astrology/nakshatraCompat";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { NakshatraSelector } from "@/components/ui/NakshatraSelector";
import { InArticleAd } from "@/components/ui/AdBanner";
import Link from "next/link";

export const metadata = seoMeta({
  title: "Nakshatra Compatibility Chart — 729 Combinations for Marriage",
  description: "Free Nakshatra compatibility chart for marriage. Check compatibility between all 27 Nakshatras with Gana, Yoni, Nadi & planetary lord matching. Select your birth star now.",
  path: "/nakshatra-compatibility",
});

export default function NakshatraCompatIndexPage() {
  // FAQ schema for rich snippets
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many Nakshatra combinations exist for marriage matching?",
        acceptedAnswer: { "@type": "Answer", text: "There are 729 possible combinations (27 × 27) when matching Nakshatras for marriage compatibility. Each combination is evaluated on Gana, Yoni, Nadi, and Graha Maitri parameters." }
      },
      {
        "@type": "Question",
        name: "What is the most important factor in Nakshatra matching?",
        acceptedAnswer: { "@type": "Answer", text: "Nadi matching carries the highest weightage (8 points out of 36). Same Nadi between partners is called Nadi Dosha and scores 0, which is considered inauspicious for marriage." }
      },
      {
        "@type": "Question",
        name: "Can Nakshatra compatibility override Kundali matching?",
        acceptedAnswer: { "@type": "Answer", text: "Nakshatra compatibility is one component of the full 36-point Ashtakoot Kundali matching system. While important, a complete Kundali match also considers Varna, Vashya, Tara, Bhakoot and other factors." }
      },
      {
        "@type": "Question",
        name: "What minimum Nakshatra compatibility score is needed for marriage?",
        acceptedAnswer: { "@type": "Answer", text: "A combined score above 18 out of 36 points is generally considered acceptable for marriage. Scores above 25 are considered good, and above 32 are excellent." }
      },
      {
        "@type": "Question",
        name: "What are remedies for low Nakshatra compatibility?",
        acceptedAnswer: { "@type": "Answer", text: "Common remedies include Nadi Dosha Shanti Puja, gemstone therapy for both partners, chanting specific planet mantras, and performing donations on auspicious days. Consulting a qualified Vedic astrologer is recommended." }
      },
    ],
  };

  return (
    <div className="section-container py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumb items={[{ label: "Nakshatra", href: "/nakshatra" }, { label: "Compatibility" }]} />

      <div className="text-center mb-10">
        <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-2">Vedic Marriage Matching</p>
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">
          Nakshatra Compatibility Chart
        </h1>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">
          Check compatibility between all 27 Nakshatras. Select your birth star and your partner&apos;s star for detailed marriage compatibility analysis with Gana, Yoni &amp; Nadi matching.
        </p>
      </div>

      {/* Interactive Selector */}
      <NakshatraSelector />

      <InArticleAd />

      {/* All 27 Nakshatras browsable grid */}
      <div className="mt-12">
        <h2 className="font-sora font-bold text-lg text-center gold-text mb-2">Browse All 27 Nakshatras</h2>
        <p className="text-xs text-[var(--text-muted)] mb-6 text-center">Click any Nakshatra to see its compatibility with all 27 stars</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
          {NAKSHATRAS.map((nak, i) => (
            <Link key={nak} href={`/nakshatra-compatibility/${slugify(nak)}-and-${slugify(NAKSHATRAS[(i + 1) % 27])}`}
              className="glass-card p-4 text-center group hover:border-gold-400/40 transition-all hover:-translate-y-1">
              <div className="text-2xl mb-1">⭐</div>
              <h3 className="font-semibold text-sm text-white group-hover:text-gold-400 transition">{nak}</h3>
              <p className="text-xs text-gold-400/60 mt-1">Check Compatibility →</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular combos for internal linking & crawlability */}
      <div className="mt-12 max-w-4xl mx-auto">
        <h2 className="font-sora font-bold text-lg text-center gold-text mb-2">Popular Compatibility Checks</h2>
        <p className="text-xs text-[var(--text-muted)] mb-4 text-center">Most searched Nakshatra combinations</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {[
            ["Ashwini","Bharani"],["Ashwini","Rohini"],["Bharani","Krittika"],
            ["Rohini","Mrigashira"],["Mrigashira","Ardra"],["Pushya","Ashlesha"],
            ["Magha","Purva Phalguni"],["Uttara Phalguni","Hasta"],["Hasta","Chitra"],
            ["Swati","Vishakha"],["Anuradha","Jyeshtha"],["Moola","Purva Ashadha"],
            ["Uttara Ashadha","Shravana"],["Shravana","Dhanishta"],["Shatabhisha","Purva Bhadrapada"],
            ["Revati","Ashwini"],
          ].map(([a,b]) => (
            <Link key={`${a}-${b}`} href={`/nakshatra-compatibility/${slugify(a)}-and-${slugify(b)}`}
              className="text-xs text-[var(--text-secondary)] hover:text-gold-400 transition py-2 px-3 bg-white/[0.02] rounded-lg text-center border border-transparent hover:border-gold-400/20">
              {a} & {b}
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ Section for SEO */}
      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="font-sora font-bold text-lg text-center gold-text mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "How many Nakshatra combinations exist?", a: "There are 729 possible combinations (27 × 27) for Nakshatra marriage matching. Each is evaluated on Gana, Yoni, Nadi, and Graha Maitri." },
            { q: "What is the most important matching factor?", a: "Nadi matching carries 8 out of 36 points — the highest. Same Nadi (Nadi Dosha) between partners scores 0 and requires remedies." },
            { q: "What minimum score is needed for marriage?", a: "A score above 18/36 is acceptable. Above 25 is good, and above 32 is excellent for marriage compatibility." },
            { q: "What if our compatibility score is low?", a: "Remedies include Nadi Dosha Shanti Puja, gemstone therapy, mantra chanting, and consulting a qualified Vedic astrologer for personalized guidance." },
          ].map((faq) => (
            <div key={faq.q} className="glass-card p-5">
              <h3 className="font-semibold text-sm text-white mb-2">{faq.q}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <InArticleAd />

      {/* CTA */}
      <div className="text-center mt-10 glass-card p-6 max-w-2xl mx-auto">
        <h2 className="font-sora font-bold text-lg gold-text mb-2">Want a Complete Kundali Match?</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">Get the full 36-point Ashtakoot matching with Manglik check, Dasha compatibility &amp; detailed remedies.</p>
        <Link href="/matching" className="gold-btn px-8 py-3 text-sm inline-block">Full Kundali Matching →</Link>
      </div>
    </div>
  );
}
