import { seoMeta } from "@/lib/seo/metadata";
import { RemediesForm } from "@/components/remedies/RemediesForm";
import { RelatedTools } from "@/components/ui/RelatedTools";
import { InArticleAd } from "@/components/ui/AdBanner";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import Link from "next/link";

export const metadata = seoMeta({
  title: "Astrology Remedies — Gemstones, Mantras, Puja & Fasting",
  description: "Free personalized Vedic astrology remedies. Gemstone suggestions, planet mantras, fasting days, lucky colors & donations based on your birth chart. Consult our AI-powered remedy finder.",
  path: "/remedies",
});

export default function RemediesPage() {
  return (
    <div className="section-container py-12">
      <Breadcrumb items={[{ label: "Astrology Remedies" }]} />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-2">Personalized Guidance</p>
          <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">
            Astrology Remedies
          </h1>
          <p className="text-[var(--text-muted)]">
            Enter your birth details for personalized gemstone, mantra & remedy recommendations.
          </p>
        </div>
        <RemediesForm />
      </div>

      <InArticleAd />

      {/* Educational Content */}
      <div className="max-w-3xl mx-auto mt-16 space-y-12">
        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">What Are Vedic Astrology Remedies?</h2>
          <div className="glass-card-bright p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              In Vedic astrology, <strong className="text-white">remedies (Upayas)</strong> are prescribed actions designed to strengthen weak or afflicted planets in your birth chart and mitigate the challenging effects of Doshas, unfavorable Dasha periods, or difficult planetary transits. The concept is rooted in the ancient belief that while planetary positions at birth create a karmic blueprint, conscious actions can modify and improve outcomes.
            </p>
            <p>
              The tradition of astrological remedies dates back thousands of years, with references in classical texts like <em>Brihat Parashara Hora Shastra</em>, <em>Phaladeepika</em>, and <em>Saravali</em>. These texts describe specific remedies for each planet, tailored to the nature of the affliction and the individual&apos;s birth chart configuration.
            </p>
            <p>
              At VivaAI, our remedy finder analyzes your planetary positions and identifies which planets need strengthening or pacification. Based on this analysis, we provide personalized recommendations across multiple remedy categories.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">Types of Vedic Remedies</h2>
          <div className="glass-card-bright p-6 sm:p-8 text-sm text-[var(--text-secondary)] leading-relaxed">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Gemstones (Ratna)", desc: "Each planet has a corresponding gemstone that amplifies its positive energy when worn correctly. Examples include Ruby for Sun, Pearl for Moon, Red Coral for Mars, and Yellow Sapphire for Jupiter. Gemstones must be prescribed based on your chart — never wear them without proper analysis." },
                { title: "Mantras & Chanting", desc: "Sacred sound vibrations (Beej Mantras) associated with each planet can harmonize planetary energies. Regular chanting — typically 108 repetitions — during the planet's specific day and Hora is recommended for maximum effect." },
                { title: "Fasting (Vrat)", desc: "Observing fasts on specific days associated with afflicted planets is a traditional remedy. For example, fasting on Saturdays helps pacify Saturn, Tuesdays for Mars, and Thursdays for Jupiter. The fast typically involves avoiding grains and consuming only fruits and milk." },
                { title: "Charity & Donation (Daan)", desc: "Donating items associated with afflicted planets on their specific days is considered highly effective. Saturn remedies include donating black sesame seeds and mustard oil on Saturdays. Sun remedies include offering wheat and jaggery on Sundays." },
                { title: "Puja & Rituals", desc: "Specific planetary pujas performed at temples or home can pacify challenging planetary influences. Navagraha Puja addresses all nine planets simultaneously, while individual planet pujas (like Shani Puja or Mangal Puja) target specific afflictions." },
                { title: "Lifestyle Adjustments", desc: "Wearing specific colors associated with beneficial planets, choosing favorable directions for important activities, and aligning daily routines with planetary hours (Hora) are subtle but effective remedial measures." },
              ].map((item) => (
                <div key={item.title} className="bg-white/[0.03] rounded-lg p-4">
                  <h3 className="font-semibold text-gold-200 mb-1.5">{item.title}</h3>
                  <p className="text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">Important Guidelines & Safety</h2>
          <div className="glass-card-bright p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              While Vedic remedies are a revered tradition, it is essential to approach them with awareness and caution:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong className="text-white">Always analyze before wearing gemstones.</strong> A gemstone that strengthens a malefic planet in your chart can amplify negative effects. Never wear powerful stones like Blue Sapphire (Neelam) without expert consultation and a trial period.</li>
              <li><strong className="text-white">Remedies complement, not replace, professional advice.</strong> For medical, legal, or financial decisions, always consult qualified professionals. Astrological remedies are for spiritual and energetic support.</li>
              <li><strong className="text-white">Consistency matters.</strong> Mantra chanting and fasting remedies work best when practiced regularly over extended periods (typically 40 days or more).</li>
              <li><strong className="text-white">Intention is key.</strong> The effectiveness of any remedy is enhanced by sincere faith, positive intention, and ethical living.</li>
            </ul>
            <p className="mt-2">
              For a deeper dive into gemstone remedies, read our <Link href="/blog/gemstones-vedic-astrology-complete-guide" className="text-gold-400 hover:underline">complete gemstone guide</Link>. To understand planetary influences first, <Link href="/kundali" className="text-gold-400 hover:underline">generate your free Kundali</Link>.
            </p>
          </div>
        </section>

        <div className="pb-4">
          <RelatedTools currentPath="/remedies" />
        </div>
      </div>
    </div>
  );
}
