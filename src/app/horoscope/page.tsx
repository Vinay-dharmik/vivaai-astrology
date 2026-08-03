import Link from "next/link";
import { seoMeta } from "@/lib/seo/metadata";
import { ZODIAC_INFO } from "@/lib/astrology/constants";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InArticleAd } from "@/components/ui/AdBanner";
import { RelatedTools } from "@/components/ui/RelatedTools";

export const metadata = seoMeta({
  title: "Daily Horoscope — All 12 Zodiac Signs | Vedic Predictions",
  description: "Free daily, weekly, monthly and yearly horoscope for all 12 zodiac signs. Vedic predictions based on your Moon sign, current planetary transits and Vimshottari Dasha periods.",
  path: "/horoscope",
  keywords: [
    "daily horoscope", "horoscope today", "zodiac predictions",
    "aries horoscope", "vedic horoscope", "moon sign horoscope",
    "rashifal today", "weekly horoscope", "monthly horoscope",
    "horoscope 2026", "zodiac forecast", "rashifal in english",
  ],
});

const SYMBOLS: Record<string, string> = {
  aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋", leo: "♌", virgo: "♍",
  libra: "♎", scorpio: "♏", sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓",
};

export default function HoroscopePage() {
  return (
    <div className="section-container py-12">
      <Breadcrumb items={[{ label: "Daily Horoscope" }]} />
      <div className="text-center mb-10">
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">Daily Horoscope</h1>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">
          Select your zodiac sign for today&apos;s horoscope prediction.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {Object.entries(ZODIAC_INFO).map(([key, info]) => (
          <Link key={key} href={`/horoscope/${key}`}
            className="glass-card p-6 text-center group hover:border-gold-400/50 transition-all hover:-translate-y-1">
            <div className="text-4xl mb-3">{SYMBOLS[key]}</div>
            <h2 className="font-semibold capitalize text-white group-hover:text-gold-400 transition">{key}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">{info.dates}</p>
            <p className="text-xs text-gold-400/70 mt-2">{info.trait}</p>
          </Link>
        ))}
      </div>
      <InArticleAd />

      {/* Educational Content */}
      <div className="max-w-3xl mx-auto mt-16 space-y-12">
        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">How Vedic Horoscopes Work</h2>
          <div className="glass-card-bright p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              A <strong className="text-white">Vedic horoscope</strong> is fundamentally different from the Western horoscopes you may find in newspapers and magazines. While Western astrology bases predictions primarily on your <em>Sun sign</em> (the constellation the Sun was in at your birth), Vedic astrology emphasizes your <strong className="text-gold-200">Moon sign (Rashi)</strong> — the zodiac sign where the Moon was positioned at your exact birth moment.
            </p>
            <p>
              The Moon moves through a zodiac sign approximately every 2.5 days, making Moon-sign predictions far more nuanced and personalized than Sun-sign readings. Since the Moon governs the mind, emotions, and daily experiences in Vedic tradition, Moon-sign horoscopes are considered more relevant for day-to-day guidance.
            </p>
            <p>
              Our daily predictions analyze the current <strong className="text-white">planetary transits</strong> — the real-time positions of planets as they move through the zodiac — and their relationship to each Moon sign. When Jupiter transits favorably to your Moon sign, expansion and luck are indicated. When Saturn makes challenging aspects, discipline and patience become necessary. These transit-based readings provide actionable guidance for each day.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">Vedic vs Western Horoscopes: Key Differences</h2>
          <div className="glass-card-bright p-6 sm:p-8 text-sm text-[var(--text-secondary)] leading-relaxed">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gold-400/20">
                    <th className="text-left py-2 text-gold-200 font-semibold">Aspect</th>
                    <th className="text-left py-2 text-gold-200 font-semibold">Vedic (Jyotish)</th>
                    <th className="text-left py-2 text-gold-200 font-semibold">Western</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5"><td className="py-2 text-white">Zodiac System</td><td>Sidereal (star-based)</td><td>Tropical (season-based)</td></tr>
                  <tr className="border-b border-white/5"><td className="py-2 text-white">Primary Sign</td><td>Moon sign (Rashi)</td><td>Sun sign</td></tr>
                  <tr className="border-b border-white/5"><td className="py-2 text-white">Prediction Method</td><td>Transits + Dasha periods</td><td>Transits + progressions</td></tr>
                  <tr className="border-b border-white/5"><td className="py-2 text-white">Lunar Mansions</td><td>27 Nakshatras (detailed)</td><td>Not used</td></tr>
                  <tr><td className="py-2 text-white">Remedial System</td><td>Gemstones, mantras, pujas</td><td>Psychological awareness</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Because of the ~23° Ayanamsa difference between tropical and sidereal zodiacs, your Vedic Sun sign may differ from your Western Sun sign. For example, if you are an &quot;Aries&quot; in Western astrology, you might be &quot;Pisces&quot; in Vedic astrology. This is why checking your <Link href="/kundali" className="text-gold-400 hover:underline">actual Vedic birth chart</Link> is important for accurate predictions.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">How to Use Your Daily Horoscope</h2>
          <div className="glass-card-bright p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              For the most accurate reading, use your <strong className="text-white">Vedic Moon sign</strong> rather than your Western Sun sign. If you are unsure of your Moon sign, <Link href="/kundali" className="text-gold-400 hover:underline">generate your free Kundali</Link> to find out. Your daily horoscope should be read as general guidance — for career, relationships, and health — shaped by the planetary transits affecting your Moon sign that day.
            </p>
            <p>
              Remember that a horoscope provides a broad overview for all people sharing a Moon sign. For truly personalized predictions that account for your unique planetary placements, house positions, and current Dasha period, a complete birth chart analysis offers significantly deeper insights.
            </p>
          </div>
        </section>

        <div className="pb-4">
          <RelatedTools currentPath="/horoscope" />
        </div>
      </div>
    </div>
  );
}
