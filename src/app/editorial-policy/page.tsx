import { seoMeta } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import Link from "next/link";

export const metadata = seoMeta({
  title: "Editorial Policy — How VivaAI Writes & Reviews Its Astrology Content",
  path: "/editorial-policy",
  description:
    "How VivaAI Astrology researches, writes, sources and reviews its content — the classical texts we rely on, how our calculations are verified, how we label tool output versus articles, and how to report an error.",
  keywords: [
    "vivaai editorial policy", "astrology content standards",
    "vedic astrology sources", "brihat parashara hora shastra",
    "lahiri ayanamsa", "astrology fact checking",
  ],
});

const SOURCES = [
  {
    title: "Brihat Parashara Hora Shastra",
    note: "The foundational classical text of Vedic astrology, attributed to Sage Parashara. Our house significations, planetary dignities, Yoga definitions and Vimshottari Dasha rules follow it.",
  },
  {
    title: "Phaladeepika (Mantreswara)",
    note: "Used for predictive rules on house results, planetary combinations and Dasha interpretation.",
  },
  {
    title: "Saravali (Kalyana Varma)",
    note: "Referenced for planet-in-sign and planet-in-house effects, and for Ashtakoot matching detail.",
  },
  {
    title: "Muhurta Chintamani & regional Panchang conventions",
    note: "Referenced for Tithi, Yoga, Karana and Rahu Kalam calculation conventions used on our Panchang page.",
  },
  {
    title: "Astronomy Engine (open-source ephemeris)",
    note: "Provides the underlying planetary positions. It implements VSOP87 and related models, which is why our sidereal longitudes agree with professional ephemerides to within a fraction of a degree.",
  },
  {
    title: "Lahiri Ayanamsa (Indian Calendar Reform Committee)",
    note: "The sidereal offset standard adopted by the Government of India. We use it for every tropical-to-sidereal conversion on the site so results match standard Indian panchangs.",
  },
];

export default function EditorialPolicyPage() {
  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: "Editorial Policy" }]} />

      <h1 className="font-sora font-bold text-3xl sm:text-4xl gold-text mb-2">Editorial Policy</h1>
      <p className="text-[var(--text-muted)] mb-8">
        How content on vivaai.in is researched, written, calculated, labelled and corrected.
      </p>

      <div className="glass-card p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
        <h2 className="text-xl font-sora font-bold text-gold-200">Who writes this site</h2>
        <p>
          VivaAI Astrology is an independently operated publication based in India. Articles are written and edited
          in-house by our editorial team, which combines working knowledge of classical Jyotish texts with a
          software background in astronomical computation. We do not accept guest posts, sponsored articles,
          or paid placements in our editorial content, and no third party can pay to influence a prediction,
          a compatibility score, or a remedy recommendation.
        </p>
        <p>
          Questions, corrections and complaints reach a real person at{" "}
          <Link href="/contact" className="text-gold-400 hover:underline">our contact page</Link>.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
        <h2 className="text-xl font-sora font-bold text-gold-200">Articles vs. calculator output</h2>
        <p>
          This is the most important distinction on the site, and we label it clearly.
        </p>
        <p>
          <strong className="text-white">Articles</strong> — everything listed on our{" "}
          <Link href="/blog" className="text-gold-400 hover:underline">blog</Link> — are written by hand. Each one is
          researched against the classical sources listed below, drafted, edited, and checked for factual accuracy
          before publication. These are the pages we ask to be judged on.
        </p>
        <p>
          <strong className="text-white">Calculator output</strong> — a Kundali, a Nakshatra pair result, a
          planet-in-house reference sheet, a numerology reading — is generated on demand from your input and from our
          rule tables. It is genuinely useful as a lookup, but it is machine-assembled reference material, not
          journalism. We therefore keep those result pages out of search indexes and do not place advertising on
          them. You get the tool; we do not dress its output up as an article.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
        <h2 className="text-xl font-sora font-bold text-gold-200">Sources we rely on</h2>
        <p>
          We do not invent astrological systems. Every rule applied on this site traces to an established classical
          source or to a published astronomical model:
        </p>
        <ul className="space-y-3 mt-3">
          {SOURCES.map((src) => (
            <li key={src.title} className="border-l-2 border-gold-400/30 pl-4">
              <div className="text-white font-semibold text-sm">{src.title}</div>
              <div className="text-xs text-[var(--text-muted)] leading-relaxed mt-0.5">{src.note}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-card p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
        <h2 className="text-xl font-sora font-bold text-gold-200">How calculations are verified</h2>
        <p>
          Before a calculation ships, we cross-check its output against reference charts computed with established
          Jyotish software and against published panchangs for the same date and location. We check the Ascendant
          (Lagna) degree, all nine graha longitudes, retrograde flags, Nakshatra and pada assignment, and the
          Vimshottari Dasha start dates. A discrepancy beyond rounding is treated as a bug, not a difference of
          opinion.
        </p>
        <p>
          Where astrologers legitimately disagree — house systems, Ayanamsa choice, divisional chart conventions —
          we state which convention we use rather than presenting one school as universal fact.
        </p>
        <p>
          The <Link href="/horoscope" className="text-gold-400 hover:underline">daily horoscope</Link> is computed,
          not written in advance. For each rashi we take the day&apos;s actual sidereal positions of the nine grahas,
          determine which bhava each one occupies counted from that rashi, and apply the classical Gochara Phala
          table from Brihat Parashara Hora Shastra to decide whether the transit is favourable. Sade Sati and the
          Kantaka and Ashtama Shani positions are detected the same way. Each sign page publishes the full transit
          table it used, so you can check the reading against the sky rather than take it on trust.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
        <h2 className="text-xl font-sora font-bold text-gold-200">On the limits of astrology</h2>
        <p>
          We publish astrological interpretation for guidance, cultural and educational interest. It is not a
          substitute for medical, legal, financial or psychological advice, and we will not tell you that it is.
          We do not publish fear-based content, we do not manufacture urgency to sell a remedy, and we do not claim
          that any gemstone, mantra or puja produces a guaranteed outcome. Our full position is set out in the{" "}
          <Link href="/disclaimer" className="text-gold-400 hover:underline">disclaimer</Link>.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
        <h2 className="text-xl font-sora font-bold text-gold-200">Corrections & updates</h2>
        <p>
          If you find an error — a wrong planetary position, a misquoted classical rule, a broken Dasha date, a typo
          that changes meaning — tell us and we will fix it. Substantive corrections to an article are made in place,
          and articles are periodically reviewed and refreshed as our calculation engine improves.
        </p>
        <p>
          Report an issue through our{" "}
          <Link href="/contact" className="text-gold-400 hover:underline">contact page</Link>. We read every message.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
        <h2 className="text-xl font-sora font-bold text-gold-200">Advertising & how we make money</h2>
        <p>
          VivaAI is funded by advertising and by optional paid reports. Advertising is clearly separated from
          editorial content and never appears inside a paragraph in a way that could be mistaken for our own words.
          Advertisers have no access to, and no influence over, what we publish or what a calculation returns.
        </p>
        <p>
          Paid reports are always described before purchase, and our{" "}
          <Link href="/refund-policy" className="text-gold-400 hover:underline">refund policy</Link> applies. Details of
          data handling are in our{" "}
          <Link href="/privacy" className="text-gold-400 hover:underline">privacy policy</Link>.
        </p>
      </div>
    </div>
  );
}
