"use client";

import { motion } from "framer-motion";
import { Star, Heart, CalendarDays, Gem, Hash, Users, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  { icon: Star, title: "Free Kundali", desc: "Complete Vedic birth chart with Lagna, Doshas, Yogas, Dasha & detailed predictions", href: "/kundali", color: "text-gold-400" },
  { icon: Heart, title: "Kundali Matching", desc: "36-point Ashtakoot guna matching with Manglik check for marriage compatibility", href: "/matching", color: "text-pink-400" },
  { icon: CalendarDays, title: "Daily Panchang", desc: "Tithi, Nakshatra, Yoga, Karana, Rahu Kalam & auspicious timings every day", href: "/panchang", color: "text-mystic-blue" },
  { icon: Gem, title: "Remedies", desc: "Personalized gemstones, mantras, fasting & lucky colors based on your chart", href: "/remedies", color: "text-mystic-green" },
  { icon: Users, title: "Zodiac Compatibility", desc: "144 sign combinations with love, friendship & career compatibility analysis", href: "/compatibility", color: "text-mystic-purple" },
  { icon: Sparkles, title: "Nakshatra Matching", desc: "729 Nakshatra combinations — marriage compatibility with Gana, Yoni & Nadi", href: "/nakshatra-compatibility", color: "text-gold-200" },
  { icon: Hash, title: "Numerology", desc: "Life Path, Expression, Soul Urge & Personality number calculations", href: "/calculator/numerology", color: "text-mystic-teal" },
  { icon: BookOpen, title: "Astrology Blog", desc: "Expert articles on Kundali, doshas, dasha system, Sade Sati & more", href: "/blog", color: "text-gold-300" },
];

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="section-container">
        <h2 className="font-sora font-bold text-3xl sm:text-4xl text-center mb-3">
          <span className="gold-text">Powerful Tools.</span> <span className="text-white">Always Free.</span>
        </h2>
        <p className="text-center text-[var(--text-muted)] mb-12 max-w-xl mx-auto">
          Everything you need for Vedic astrology insights — no sign-up, no hidden fees.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link href={f.href}
                className="glass-card p-5 block group hover:border-gold-400/40 transition-all hover:-translate-y-1 h-full">
                <f.icon className={`w-8 h-8 ${f.color} mb-3 group-hover:scale-110 transition-transform`} />
                <h3 className="font-semibold text-white group-hover:text-gold-400 transition mb-1">{f.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
