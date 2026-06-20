import { seoMeta } from "@/lib/seo/metadata";
import { PanchangDisplay } from "@/components/calculators/PanchangDisplay";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InArticleAd } from "@/components/ui/AdBanner";
import { RelatedTools } from "@/components/ui/RelatedTools";
import Link from "next/link";

export const metadata = seoMeta({
  title: "Today's Panchang — Hindu Calendar, Tithi, Nakshatra & Muhurat",
  description: "Free daily Panchang with Tithi, Nakshatra, Yoga, Karana, Rahu Kalam & auspicious timings. Check today's Hindu calendar for festivals, muhurats & religious observances.",
  path: "/panchang",
  keywords: [
    "panchang today", "daily panchang", "tithi today", "nakshatra today",
    "rahu kalam today", "hindu calendar", "auspicious time today",
    "muhurat today", "shubh muhurat", "panchang 2026",
  ],
});

export default function PanchangPage() {
  return (
    <div className="section-container py-12 max-w-2xl mx-auto">
      <Breadcrumb items={[{ label: "Daily Panchang" }]} />
      <div className="text-center mb-8">
        <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-2">Hindu Calendar</p>
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">Daily Panchang</h1>
        <p className="text-[var(--text-muted)]">
          Check Tithi, Nakshatra, Yoga, Karana & auspicious timings for any date.
        </p>
      </div>
      <PanchangDisplay />
      <InArticleAd />

      {/* Educational Content */}
      <div className="mt-16 space-y-12">
        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">What is Panchang? The Five Limbs of the Hindu Calendar</h2>
          <div className="glass-card-bright p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              The <strong className="text-white">Panchang</strong> (Sanskrit: &#x092A;&#x091E;&#x094D;&#x091A;&#x093E;&#x0902;&#x0917;, literally &quot;five limbs&quot;) is the traditional Hindu almanac and calendar system used for thousands of years across India to determine auspicious timings, plan religious ceremonies, and guide daily activities. It is based on the combined movements of the <strong className="text-gold-200">Sun and Moon</strong>.
            </p>
            <p>
              The five components are: <em>Tithi</em> (lunar day), <em>Nakshatra</em> (lunar mansion), <em>Yoga</em> (luni-solar combination), <em>Karana</em> (half-Tithi), and <em>Var</em> (day of the week). Together, these provide a complete picture of the day&apos;s astrological quality, helping millions make informed decisions about wedding dates, business launches, and religious observances.
            </p>
            <p>
              Even today, the Panchang remains central to Hindu daily life. Temples use it to schedule pujas, families consult it for naming ceremonies and housewarming events, and astrologers rely on it for <strong className="text-gold-200">Muhurat selection</strong> — choosing the most auspicious moment for important activities.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">The Five Elements of Daily Panchang Explained</h2>
          <div className="glass-card-bright p-6 sm:p-8 text-sm text-[var(--text-secondary)] leading-relaxed space-y-5">
            <div>
              <h3 className="font-semibold text-gold-200 mb-2">1. Tithi — The Lunar Day</h3>
              <p>There are 30 Tithis in a lunar month — 15 in the waxing phase (Shukla Paksha) and 15 in the waning phase (Krishna Paksha). Key Tithis include <strong className="text-white">Purnima</strong> (Full Moon, ideal for worship), <strong className="text-white">Amavasya</strong> (New Moon, for ancestral rites), and <strong className="text-white">Ekadashi</strong> (sacred fasting day).</p>
            </div>
            <div>
              <h3 className="font-semibold text-gold-200 mb-2">2. Nakshatra — The Lunar Mansion</h3>
              <p>The Moon transits all <Link href="/nakshatra" className="text-gold-400 hover:underline">27 Nakshatras</Link> each month. Each has specific qualities: <strong className="text-white">Rohini</strong> is excellent for marriage, <strong className="text-white">Pushya</strong> favors business, and <strong className="text-white">Ashwini</strong> is ideal for medical treatments.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gold-200 mb-2">3. Yoga — The Luni-Solar Combination</h3>
              <p>27 Yogas are formed by the combined longitude of the Sun and Moon. <strong className="text-white">Siddhi Yoga</strong> brings success and <strong className="text-white">Amrita Yoga</strong> is the most favorable, while <strong className="text-white">Vyatipata</strong> requires caution.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gold-200 mb-2">4. Karana — The Half-Tithi</h3>
              <p>Each Tithi is divided into two Karanas (11 types total), providing finer granularity for activity planning and Muhurat calculations for short-duration events.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gold-200 mb-2">5. Var — The Day of the Week</h3>
              <p>Each day is ruled by a planet: Sunday (Sun), Monday (Moon), Tuesday (Mars), Wednesday (Mercury), Thursday (Jupiter), Friday (Venus), Saturday (Saturn). The ruler influences the day&apos;s energy for specific activities.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">Rahu Kalam & Inauspicious Timings</h2>
          <div className="glass-card-bright p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              <strong className="text-white">Rahu Kalam</strong> is a 1.5-hour window each day considered inauspicious for starting new activities. It varies by day and location. During Rahu Kalam, avoid signing contracts, starting journeys, or launching ventures.
            </p>
            <p>
              Other periods include <strong className="text-gold-200">Yamagandam</strong> and <strong className="text-gold-200">Gulika Kalam</strong>. While Rahu Kalam should be avoided for <em>new</em> beginnings, continuing ongoing activities and spiritual practices is fine.
            </p>
            <p>
              Our calculator computes Rahu Kalam automatically for your date. For more, read our <Link href="/blog/panchang-daily-hindu-calendar-guide" className="text-gold-400 hover:underline">complete Panchang guide</Link>.
            </p>
          </div>
        </section>

        <div className="pb-4">
          <RelatedTools currentPath="/panchang" />
        </div>
      </div>
    </div>
  );
}
