import { seoMeta } from "@/lib/seo/metadata";
import { KundaliForm } from "@/components/kundali/KundaliForm";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { RelatedTools } from "@/components/ui/RelatedTools";
import { InArticleAd } from "@/components/ui/AdBanner";
import Link from "next/link";

export const metadata = seoMeta({
  title: "Free Kundali Generator — Vedic Birth Chart with AI Predictions",
  description: "Generate your free Vedic Kundali instantly. Accurate Lagna, Moon sign, Nakshatra, planetary positions, Vimshottari Dasha, Dosha analysis & AI-powered interpretations. No sign-up required.",
  path: "/kundali",
  keywords: [
    "free kundali generator", "janam kundali online", "vedic birth chart",
    "lagna chart calculator", "moon sign finder", "nakshatra calculator",
    "vimshottari dasha", "manglik dosha check", "free janam patri",
    "kundali software online", "birth chart generator free", "rashi calculator",
  ],
});

export default function KundaliPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "VivaAI Free Kundali Generator",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description: "Free Vedic Kundali with Lagna, Nakshatra, Dasha, Doshas, Yogas & AI predictions.",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a Kundali in Vedic Astrology?",
        acceptedAnswer: { "@type": "Answer", text: "A Kundali (also called Janam Kundali or Janam Patri) is a Vedic birth chart that maps the exact positions of all nine planets (Navagrahas) across the 12 houses and zodiac signs at the precise moment and location of your birth. It serves as your cosmic blueprint, revealing personality traits, career potential, relationship compatibility, health tendencies, and the timing of major life events." },
      },
      {
        "@type": "Question",
        name: "How accurate is the VivaAI Kundali generator?",
        acceptedAnswer: { "@type": "Answer", text: "VivaAI uses the Astronomy Engine library with Lahiri Ayanamsa for high-precision sidereal calculations. Our planetary positions match professional astrology software like AstroSage and Kundli Software to within 0.01° accuracy. The accuracy depends on the precision of birth time provided — even a few minutes can change the Ascendant." },
      },
      {
        "@type": "Question",
        name: "Is the Kundali report really free?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, the complete Kundali report is 100% free with no sign-up required. You get the full birth chart with all 9 planets, Dosha analysis, Yoga detection, Vimshottari Dasha timeline, predictions, gemstone recommendations, and remedies. A premium PDF download option is available for a nominal fee if you want to save or print your report." },
      },
      {
        "@type": "Question",
        name: "What information do I need to generate my Kundali?",
        acceptedAnswer: { "@type": "Answer", text: "You need three pieces of information: your exact date of birth, your time of birth (as precise as possible), and your place of birth. The time of birth is especially important as it determines your Ascendant (Lagna), which changes approximately every two hours." },
      },
    ],
  };

  return (
    <div className="section-container py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumb items={[{ label: "Free Kundali" }]} />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-2">Vedic Astrology</p>
          <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">
            Free Kundali Generator
          </h1>
          <p className="text-[var(--text-muted)]">
            Enter your birth details for an accurate Vedic birth chart with AI-powered insights.
          </p>
        </div>
        <KundaliForm />
      </div>

      <InArticleAd />

      {/* ── Educational Content Section ── */}
      <div className="max-w-3xl mx-auto mt-16 space-y-12">

        {/* What is a Kundali */}
        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">What is a Kundali? Understanding Your Vedic Birth Chart</h2>
          <div className="glass-card-bright p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              A <strong className="text-white">Kundali</strong> (also known as <em>Janam Kundali</em>, <em>Janam Patri</em>, or <em>Vedic Birth Chart</em>) is the foundational document of <strong className="text-gold-200">Vedic astrology (Jyotish Shastra)</strong>. It is essentially a celestial snapshot — a precise map of the sky at the exact moment and geographical location of your birth, capturing the positions of all nine Vedic planets (Navagrahas) across the twelve houses and zodiac signs.
            </p>
            <p>
              Unlike Western astrology, which uses the tropical zodiac based on the seasons, Vedic astrology employs the <strong className="text-gold-200">sidereal zodiac</strong>, which is aligned with the actual positions of the constellations. This means your Vedic Sun sign may differ from your Western Sun sign by approximately 23 degrees — a correction known as the <em>Ayanamsa</em>. At VivaAI, we use the widely-accepted <strong className="text-white">Lahiri Ayanamsa</strong>, the same standard recommended by the Indian government&apos;s Calendar Reform Committee and used by the majority of professional Vedic astrologers across India.
            </p>
            <p>
              Your Kundali is sometimes called your &quot;cosmic DNA&quot; because it reveals deeply personal information about your personality traits, intellectual strengths, emotional patterns, career aptitudes, relationship compatibility, health vulnerabilities, financial prospects, and the timing of significant life events. For centuries, families across India have relied on Kundali charts for making important decisions — from choosing auspicious dates for weddings and business launches to understanding a child&apos;s innate talents and life path.
            </p>
          </div>
        </section>

        {/* How We Calculate */}
        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">How VivaAI Calculates Your Kundali</h2>
          <div className="glass-card-bright p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              Our Kundali generator combines <strong className="text-white">modern astronomical precision</strong> with <strong className="text-gold-200">traditional Vedic interpretation</strong>. Here is the step-by-step methodology we use to create your birth chart:
            </p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-gold-400 font-bold shrink-0">1.</span>
                <p><strong className="text-white">Astronomical Calculation</strong> — We use the <em>Astronomy Engine</em> library to compute the precise ecliptic longitude of the Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, and the lunar nodes (Rahu and Ketu) at your exact birth moment. These calculations account for planetary perturbations, orbital mechanics, and the equation of time.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-gold-400 font-bold shrink-0">2.</span>
                <p><strong className="text-white">Ayanamsa Correction</strong> — The tropical longitudes are converted to sidereal positions by subtracting the Lahiri Ayanamsa value for your birth year. This aligns the chart with the actual fixed stars, as Vedic tradition requires.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-gold-400 font-bold shrink-0">3.</span>
                <p><strong className="text-white">Ascendant Determination</strong> — Using your birth latitude, longitude, and local sidereal time, we calculate the exact degree of the zodiac rising on the eastern horizon — your <em>Lagna</em> (Ascendant). This is the most time-sensitive element of the chart and determines the entire house structure.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-gold-400 font-bold shrink-0">4.</span>
                <p><strong className="text-white">House Assignment</strong> — Using the Whole-Sign house system (the most commonly used system in Vedic astrology), each planet is placed in its appropriate house and sign, creating the familiar twelve-house chart diagram.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-gold-400 font-bold shrink-0">5.</span>
                <p><strong className="text-white">Interpretation Layer</strong> — Traditional Vedic rules are applied to identify Doshas (afflictions like Manglik Dosha, Kaal Sarp Dosha), Yogas (auspicious combinations like Gajakesari Yoga, Raj Yoga), planetary strengths, and the complete Vimshottari Dasha timeline spanning 120 years.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Components */}
        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">Key Components of Your Kundali Report</h2>
          <div className="glass-card-bright p-6 sm:p-8 text-sm text-[var(--text-secondary)] leading-relaxed">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Lagna (Ascendant)", desc: "The zodiac sign rising on the eastern horizon at your birth. It governs your physical appearance, personality, temperament, and overall approach to life. The Lagna lord's placement shapes your life path." },
                { title: "Moon Sign (Rashi)", desc: "The zodiac sign where the Moon was positioned at birth. In Vedic astrology, the Moon sign is considered more important than the Sun sign, as it governs your mind, emotions, and mental well-being." },
                { title: "Nakshatra (Birth Star)", desc: "The specific lunar mansion (out of 27) where your Moon was located. Your Nakshatra determines your Vimshottari Dasha starting period, core personality, and compatibility in marriage matching." },
                { title: "Planetary Positions", desc: "The exact placement of all 9 Vedic planets across the 12 houses and signs. Each planet's house, sign, and dignity (exalted, debilitated, own sign) influences specific life areas." },
                { title: "Vimshottari Dasha", desc: "The 120-year planetary period system that provides a timeline of life events. Your current Mahadasha (major period) and Antardasha (sub-period) indicate which planetary themes are most active in your life right now." },
                { title: "Doshas & Yogas", desc: "Doshas are planetary afflictions (like Manglik Dosha) that require remedies. Yogas are auspicious planetary combinations (like Raj Yoga, Gajakesari Yoga) that bestow special blessings in career, wealth, or wisdom." },
              ].map((item) => (
                <div key={item.title} className="bg-white/[0.03] rounded-lg p-4">
                  <h3 className="font-semibold text-gold-200 mb-1.5">{item.title}</h3>
                  <p className="text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Interpret */}
        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">How to Read and Interpret Your Results</h2>
          <div className="glass-card-bright p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              Once your Kundali is generated, start by examining your <strong className="text-white">Lagna (Ascendant)</strong> — this is the anchor of your entire chart. The sign and its ruling planet set the tone for your personality and life direction. Next, check your <strong className="text-gold-200">Moon sign and Nakshatra</strong>, which reveal your emotional nature and mental patterns.
            </p>
            <p>
              Pay special attention to the <strong className="text-white">Vimshottari Dasha timeline</strong>. The Mahadasha you are currently running tells you which planet is most influential in your life right now. For example, if you are in Jupiter Mahadasha, themes of wisdom, expansion, and teaching will be prominent. If you are in Saturn Mahadasha, discipline, hard work, and karmic lessons will dominate.
            </p>
            <p>
              Check the <strong className="text-gold-200">Dosha section</strong> carefully — Manglik Dosha is particularly important for marriage decisions. However, remember that many cancellation conditions exist, and our report highlights these automatically. Finally, review the <strong className="text-white">Yoga section</strong> to discover special planetary combinations in your chart that indicate blessings in specific life areas.
            </p>
            <p>
              For a deeper understanding, explore our <Link href="/blog/what-is-kundali-vedic-birth-chart" className="text-gold-400 hover:underline">complete Kundali guide</Link> or learn <Link href="/blog/how-to-read-kundali-beginners-guide" className="text-gold-400 hover:underline">how to read a birth chart step-by-step</Link>.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: "What is a Kundali in Vedic Astrology?", a: "A Kundali (Janam Kundali) is a Vedic birth chart that maps the exact positions of all nine planets across the 12 houses and zodiac signs at your birth moment. It serves as your cosmic blueprint, revealing personality traits, career potential, relationship compatibility, and the timing of major life events through the Vimshottari Dasha system." },
              { q: "How accurate is the VivaAI Kundali generator?", a: "We use the Astronomy Engine library with Lahiri Ayanamsa for high-precision sidereal calculations. Our planetary positions match professional software like AstroSage to within 0.01° accuracy. The accuracy depends on the precision of birth time provided — even a few minutes can change the Ascendant." },
              { q: "Is the Kundali report really free?", a: "Yes, the complete Kundali report is 100% free with no sign-up required. You get the full birth chart with all 9 planets, Dosha analysis, Yoga detection, Vimshottari Dasha timeline, predictions, gemstone recommendations, and remedies." },
              { q: "What information do I need to generate my Kundali?", a: "You need three pieces of information: your exact date of birth, your time of birth (as precise as possible), and your place of birth. The time of birth is especially critical as it determines your Ascendant (Lagna)." },
              { q: "How is Vedic astrology different from Western astrology?", a: "Vedic astrology uses the sidereal zodiac (aligned with actual star positions) while Western astrology uses the tropical zodiac (aligned with seasons). This creates a ~23° difference. Vedic astrology also emphasizes the Moon sign, Nakshatra system, and Dasha predictive timeline, which Western astrology does not use." },
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
          <RelatedTools currentPath="/kundali" />
        </div>
      </div>
    </div>
  );
}
