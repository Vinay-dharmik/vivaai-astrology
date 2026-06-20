import { seoMeta } from "@/lib/seo/metadata";
import { MatchingForm } from "@/components/matching/MatchingForm";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { RelatedTools } from "@/components/ui/RelatedTools";
import { InArticleAd } from "@/components/ui/AdBanner";
import Link from "next/link";

export const metadata = seoMeta({
  title: "Free Kundali Matching — 36-Point Ashtakoot Guna Score",
  description: "Free Kundali matching with 36-point Ashtakoot guna analysis. Check marriage compatibility, Manglik dosha, Nadi dosha & relationship insights instantly. No sign-up required.",
  path: "/matching",
  keywords: [
    "kundali matching free", "gun milan online", "horoscope matching",
    "marriage compatibility", "ashtakoot score", "36 guna match",
    "nadi dosha", "manglik check", "kundli milan", "guna matching",
  ],
});

export default function MatchingPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Kundali Matching?",
        acceptedAnswer: { "@type": "Answer", text: "Kundali Matching (also called Gun Milan or Horoscope Matching) is a Vedic astrology method that evaluates marriage compatibility by comparing the birth charts of two individuals across 8 parameters totaling 36 points. It has been used for centuries in Hindu marriages to assess the harmony between prospective partners." },
      },
      {
        "@type": "Question",
        name: "What is a good score in Ashtakoot matching?",
        acceptedAnswer: { "@type": "Answer", text: "A score of 18 or above out of 36 is considered acceptable for marriage. Scores between 25-32 indicate good compatibility, while 33-36 represents an excellent match. Scores below 18 are generally not recommended without additional remedial measures." },
      },
      {
        "@type": "Question",
        name: "What is Nadi Dosha in Kundali Matching?",
        acceptedAnswer: { "@type": "Answer", text: "Nadi Dosha occurs when both partners share the same Nadi (energy type), scoring 0 out of 8 points in the Nadi category. It is the most significant dosha in marriage matching, carrying the maximum weightage. However, several cancellation conditions exist that can neutralize its effects." },
      },
    ],
  };

  return (
    <div className="section-container py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumb items={[{ label: "Kundali Matching" }]} />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-2">Marriage Compatibility</p>
          <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">
            Kundali Matching
          </h1>
          <p className="text-[var(--text-muted)]">
            Enter birth details of both partners for Ashtakoot guna matching with 36-point analysis.
          </p>
        </div>
        <MatchingForm />
      </div>

      <InArticleAd />

      {/* ── Educational Content Section ── */}
      <div className="max-w-3xl mx-auto mt-16 space-y-12">

        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">What is Kundali Matching (Gun Milan)?</h2>
          <div className="glass-card-bright p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              <strong className="text-white">Kundali Matching</strong>, also known as <em>Gun Milan</em>, <em>Horoscope Matching</em>, or <em>Kundli Milan</em>, is one of the most important pre-marriage rituals in Hindu culture. This ancient Vedic astrology method evaluates the compatibility between two individuals by comparing their birth charts (Kundalis) across <strong className="text-gold-200">eight distinct parameters</strong>, collectively known as the <em>Ashtakoot</em> system.
            </p>
            <p>
              The practice has been followed for thousands of years across India, with references found in classical Vedic astrology texts like <em>Brihat Parashara Hora Shastra</em> and <em>Muhurta Chintamani</em>. The underlying principle is that the planetary positions at birth create an energetic blueprint, and when two blueprints are harmonious, the relationship is likely to thrive. When they clash, specific challenges may arise in areas like temperament, physical compatibility, financial stability, or progeny.
            </p>
            <p>
              At VivaAI, our matching algorithm applies the same traditional rules used by professional Vedic astrologers, computed using the precise Moon sign and Nakshatra of both partners derived from their birth charts.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">The 8 Ashtakoot Parameters Explained</h2>
          <div className="glass-card-bright p-6 sm:p-8 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p className="mb-4">
              The Ashtakoot system evaluates compatibility across eight dimensions, each carrying different weightage for a total of <strong className="text-white">36 points</strong>. Here is what each parameter measures:
            </p>
            <div className="space-y-4">
              {[
                { name: "Varna (1 Point)", desc: "Measures spiritual and ego compatibility. The four Varnas (Brahmin, Kshatriya, Vaishya, Shudra) represent different spiritual development levels. A harmonious Varna match indicates compatible spiritual growth." },
                { name: "Vashya (2 Points)", desc: "Determines mutual attraction and influence in the relationship. It classifies individuals into categories (Human, Wild, Quadruped, Water, Insect) and checks which partner will have more natural influence over the other." },
                { name: "Tara (3 Points)", desc: "Assesses the birth star compatibility using a 27-Nakshatra wheel. It calculates the Nakshatra distance between partners and determines the overall health, well-being, and longevity of the relationship." },
                { name: "Yoni (4 Points)", desc: "Evaluates physical and sexual compatibility through animal symbols assigned to each Nakshatra. There are 14 animal types, and matching considers natural friendship or enmity between species." },
                { name: "Graha Maitri (5 Points)", desc: "Checks the friendship between the ruling planets of both partners' Moon signs. This determines intellectual and emotional harmony — whether the couple can communicate effectively and understand each other's thought processes." },
                { name: "Gana (6 Points)", desc: "Matches temperament types: Deva (gentle, spiritual), Manushya (balanced, practical), or Rakshasa (intense, independent). Same Gana matches score highest. Cross-Gana matching has specific compatibility rules." },
                { name: "Bhakoot (7 Points)", desc: "Examines the relative position of Moon signs for financial stability and family harmony. Certain combinations like 2/12 and 6/8 are considered challenging, while 5/9 and 3/11 are favorable." },
                { name: "Nadi (8 Points)", desc: "The most important parameter with maximum weightage. It assesses health compatibility and progeny prospects. Same Nadi (Aadi-Aadi, Madhya-Madhya, or Antya-Antya) scores 0/8 — called Nadi Dosha." },
              ].map((item) => (
                <div key={item.name} className="bg-white/[0.03] rounded-lg p-4">
                  <h3 className="font-semibold text-gold-200 mb-1">{item.name}</h3>
                  <p className="text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">Understanding Your Compatibility Score</h2>
          <div className="glass-card-bright p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-400/20">
                    <th className="text-left py-2 text-gold-200 font-semibold">Score Range</th>
                    <th className="text-left py-2 text-gold-200 font-semibold">Rating</th>
                    <th className="text-left py-2 text-gold-200 font-semibold">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  <tr className="border-b border-white/5"><td className="py-2">0 – 17</td><td>Not Recommended</td><td>Significant challenges expected. Consult an experienced astrologer for remedial options before proceeding.</td></tr>
                  <tr className="border-b border-white/5"><td className="py-2">18 – 24</td><td>Acceptable</td><td>Compatibility is workable with some adjustments. Specific remedies may help address weak areas.</td></tr>
                  <tr className="border-b border-white/5"><td className="py-2">25 – 32</td><td>Good</td><td>Strong compatibility across most parameters. The relationship has a solid foundation for a harmonious marriage.</td></tr>
                  <tr><td className="py-2">33 – 36</td><td>Excellent</td><td>Exceptional compatibility. A rare and highly auspicious match with natural harmony in all life areas.</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Remember that the Ashtakoot score is one component of a comprehensive compatibility analysis. A skilled Vedic astrologer also examines <strong className="text-white">Manglik Dosha</strong> in both charts, planetary strengths, the <strong className="text-gold-200">7th house</strong> (marriage house) condition, and <strong className="text-white">Dasha compatibility</strong> to provide a complete picture. Our tool checks for Manglik Dosha automatically as part of the report.
            </p>
            <p>
              For a deeper understanding of the matching process, read our <Link href="/blog/kundali-matching-ashtakoot-guide" className="text-gold-400 hover:underline">complete guide to Ashtakoot matching</Link> or learn about <Link href="/blog/nakshatra-compatibility-marriage-guide" className="text-gold-400 hover:underline">Nakshatra compatibility for marriage</Link>.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: "What is Kundali Matching?", a: "Kundali Matching (Gun Milan) is a Vedic astrology method that evaluates marriage compatibility by comparing birth charts across 8 parameters totaling 36 points. It has been the standard pre-marriage assessment in Hindu culture for thousands of years." },
              { q: "What is a good score in Ashtakoot matching?", a: "A score of 18 or above out of 36 is considered acceptable. 25-32 indicates good compatibility, while 33-36 is an excellent match. Below 18 is generally not recommended without remedial measures and expert consultation." },
              { q: "What is Nadi Dosha?", a: "Nadi Dosha occurs when both partners share the same Nadi type (Aadi, Madhya, or Antya), scoring 0/8 on the most heavily weighted parameter. Cancellation conditions include: same Rashi but different Nakshatras, or Jupiter/Venus aspecting the 7th house." },
              { q: "Should I reject a match with a low score?", a: "Not necessarily. The Ashtakoot score is an important indicator but not the only factor. Consult a qualified Vedic astrologer who can examine both complete birth charts, check for cancellation conditions, and suggest specific remedies if needed." },
            ].map((faq) => (
              <details key={faq.q} className="glass-card group">
                <summary className="p-4 cursor-pointer flex items-center justify-between text-sm font-medium text-white group-hover:text-gold-400 transition">
                  {faq.q}
                  <span className="text-gold-400 ml-2 shrink-0">+</span>
                </summary>
                <div className="px-4 pb-4 border-t border-[var(--border)]">
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed pt-3">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <div className="pb-4">
          <RelatedTools currentPath="/matching" />
        </div>
      </div>
    </div>
  );
}
