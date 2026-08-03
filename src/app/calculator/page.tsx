import { seoMeta } from "@/lib/seo/metadata";
import Link from "next/link";
import { Hash, Star, Sun, Gem, Heart, CalendarDays, Users, Sparkles, Palette, Shield, Calendar } from "lucide-react";
import { InArticleAd } from "@/components/ui/AdBanner";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { RelatedTools } from "@/components/ui/RelatedTools";

export const metadata = seoMeta({
  title: "Free Astrology Calculators & Tools — 14 Vedic Tools",
  description: "Free astrology calculators — Kundali, Numerology, Mangal Dosha, Marriage Age, Lucky Number, Lucky Color, Panchang, Compatibility & more. Accurate Vedic calculations powered by astronomical engines.",
  path: "/calculator",
});

const CALCS = [
  { href: "/kundali", icon: Star, title: "Kundali Generator", desc: "Full Vedic birth chart with Lagna, Dasha, Doshas & Yogas", badge: "Popular" },
  { href: "/matching", icon: Heart, title: "Kundali Matching", desc: "36-point Ashtakoot compatibility analysis for marriage" },
  { href: "/horoscope", icon: Sun, title: "Daily Horoscope", desc: "Free daily predictions for all 12 zodiac signs" },
  { href: "/panchang", icon: CalendarDays, title: "Daily Panchang", desc: "Tithi, Nakshatra, Yoga, Karana & Rahu Kalam" },
  { href: "/calculator/mangal-dosha", icon: Shield, title: "Mangal Dosha Check", desc: "Free Manglik test with severity & remedies", badge: "New" },
  { href: "/calculator/marriage-age", icon: Calendar, title: "Marriage Age Prediction", desc: "Predict marriage timing from Venus & 7th house", badge: "New" },
  { href: "/calculator/lucky-number", icon: Sparkles, title: "Lucky Number Today", desc: "Daily lucky number based on birth date & numerology", badge: "New" },
  { href: "/calculator/lucky-color", icon: Palette, title: "Lucky Color Today", desc: "Daily lucky color by zodiac sign & planetary ruler", badge: "New" },
  { href: "/calculator/numerology", icon: Hash, title: "Numerology Calculator", desc: "Life Path, Expression & Soul Urge numbers" },
  { href: "/calculator/age", icon: CalendarDays, title: "Age Calculator", desc: "Exact age in years, months, days, hours & seconds" },
  { href: "/compatibility", icon: Users, title: "Zodiac Compatibility", desc: "144 sign combinations with detailed analysis" },
  { href: "/nakshatra-compatibility", icon: Sparkles, title: "Nakshatra Matching", desc: "729 Nakshatra combinations for marriage compatibility" },
  { href: "/nakshatra", icon: Sparkles, title: "27 Nakshatras", desc: "Complete guide to all lunar mansions" },
  { href: "/remedies", icon: Gem, title: "Remedy Finder", desc: "Gemstones, mantras & personalized remedies" },
];

export default function CalculatorPage() {
  return (
    <div className="section-container py-12 max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: "Astrology Tools" }]} />
      <div className="text-center mb-10">
        <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-2">14 Free Tools</p>
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">Astrology Tools & Calculators</h1>
        <p className="text-[var(--text-muted)]">Free Vedic astrology tools — no sign-up needed. Accurate calculations powered by astronomical engines.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {CALCS.map((c) => (
          <Link key={c.href} href={c.href}
            className="glass-card p-5 group hover:border-gold-400/40 transition-all hover:-translate-y-1 flex gap-4 items-start relative">
            {"badge" in c && c.badge && (
              <span className={`absolute top-3 right-3 text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${c.badge === "New" ? "bg-mystic-green/20 text-mystic-green" : "bg-gold-400/20 text-gold-400"}`}>
                {c.badge}
              </span>
            )}
            <div className="w-10 h-10 rounded-lg bg-gold-400/10 flex items-center justify-center shrink-0 group-hover:bg-gold-400/20 transition">
              <c.icon className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white group-hover:text-gold-400 transition">{c.title}</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      <InArticleAd />

      {/* Educational Content */}
      <div className="mt-16 space-y-12">
        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">About Our Vedic Astrology Tools</h2>
          <div className="glass-card-bright p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              VivaAI offers a comprehensive suite of <strong className="text-white">14 free Vedic astrology calculators</strong> designed to provide accurate, instant astrological insights without requiring sign-up or payment. Each tool is built using the same rigorous astronomical calculations used by professional astrology software.
            </p>
            <p>
              Positions are computed from the periodic series published in Jean Meeus&apos;s <em>Astronomical Algorithms</em> — the full 60-term lunar series for the Moon, and Keplerian elements with resonance and light-time corrections for the visible planets. We then apply the <strong className="text-white">Lahiri Ayanamsa</strong> (the standard recommended by the Indian Calendar Reform Committee) to convert tropical positions to the sidereal zodiac used in Vedic astrology. A verification script checks the result against published equinox, solstice and eclipse timings.
            </p>
            <p>
              Unlike many astrology websites that use pre-computed tables or simplified algorithms, our tools perform <strong className="text-gold-200">real-time astronomical calculations</strong> for every query. This means your Kundali, Panchang, and compatibility results are computed fresh using the actual orbital mechanics of each planet — accounting for perturbations, precession, and nutation.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">How to Choose the Right Tool</h2>
          <div className="glass-card-bright p-6 sm:p-8 text-sm text-[var(--text-secondary)] leading-relaxed space-y-4">
            <p>
              <strong className="text-white">For personal insights:</strong> Start with the <Link href="/kundali" className="text-gold-400 hover:underline">Kundali Generator</Link> — it provides your complete birth chart with personality analysis, career predictions, and Dasha timeline. This is the most comprehensive single tool.
            </p>
            <p>
              <strong className="text-white">For marriage decisions:</strong> Use both <Link href="/matching" className="text-gold-400 hover:underline">Kundali Matching</Link> (36-point Ashtakoot score) and <Link href="/nakshatra-compatibility" className="text-gold-400 hover:underline">Nakshatra Compatibility</Link> for a complete picture. Also check <Link href="/calculator/mangal-dosha" className="text-gold-400 hover:underline">Mangal Dosha</Link> for both partners.
            </p>
            <p>
              <strong className="text-white">For daily guidance:</strong> Check the <Link href="/panchang" className="text-gold-400 hover:underline">Daily Panchang</Link> for auspicious timings and <Link href="/horoscope" className="text-gold-400 hover:underline">Daily Horoscope</Link> for your zodiac sign&apos;s daily prediction. The <Link href="/calculator/lucky-number" className="text-gold-400 hover:underline">Lucky Number</Link> and <Link href="/calculator/lucky-color" className="text-gold-400 hover:underline">Lucky Color</Link> tools add fun daily guidance.
            </p>
            <p>
              <strong className="text-white">For remedial measures:</strong> The <Link href="/remedies" className="text-gold-400 hover:underline">Remedy Finder</Link> provides personalized gemstone, mantra, and fasting recommendations based on your birth chart&apos;s planetary strengths and weaknesses.
            </p>
          </div>
        </section>

        <div className="pb-4">
          <RelatedTools currentPath="/calculator" />
        </div>
      </div>
    </div>
  );
}
