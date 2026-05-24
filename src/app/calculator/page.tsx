import { seoMeta } from "@/lib/seo/metadata";
import Link from "next/link";
import { Hash, Star, Sun, Gem, Heart, CalendarDays, Users, Sparkles } from "lucide-react";

export const metadata = seoMeta({
  title: "Free Astrology Calculators & Tools",
  description: "Free astrology calculators — Kundali, Numerology, Panchang, Compatibility, Nakshatra & more. Accurate Vedic calculations instantly.",
  path: "/calculator",
});

const CALCS = [
  { href: "/kundali", icon: Star, title: "Kundali Generator", desc: "Full Vedic birth chart with Lagna, Dasha, Doshas & Yogas" },
  { href: "/matching", icon: Heart, title: "Kundali Matching", desc: "36-point Ashtakoot compatibility analysis" },
  { href: "/horoscope", icon: Sun, title: "Daily Horoscope", desc: "Free daily predictions for all 12 zodiac signs" },
  { href: "/panchang", icon: CalendarDays, title: "Daily Panchang", desc: "Tithi, Nakshatra, Yoga, Karana & Rahu Kalam" },
  { href: "/calculator/numerology", icon: Hash, title: "Numerology", desc: "Life Path, Expression & Soul Urge numbers" },
  { href: "/calculator/age", icon: CalendarDays, title: "Age Calculator", desc: "Exact age in years, months, days, hours & seconds" },
  { href: "/compatibility", icon: Users, title: "Zodiac Compatibility", desc: "144 sign combinations with detailed analysis" },
  { href: "/nakshatra-compatibility", icon: Sparkles, title: "Nakshatra Matching", desc: "729 Nakshatra combinations for marriage compatibility" },
  { href: "/nakshatra", icon: Sparkles, title: "27 Nakshatras", desc: "Complete guide to all lunar mansions" },
  { href: "/remedies", icon: Gem, title: "Remedy Finder", desc: "Gemstones, mantras & personalized remedies" },
];

export default function CalculatorPage() {
  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">Astrology Tools & Calculators</h1>
        <p className="text-[var(--text-muted)]">Free Vedic astrology tools — no sign-up needed.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {CALCS.map((c) => (
          <Link key={c.href} href={c.href}
            className="glass-card p-5 group hover:border-gold-400/40 transition-all hover:-translate-y-1 flex gap-4 items-start">
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
    </div>
  );
}
