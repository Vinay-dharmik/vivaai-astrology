"use client";

import { motion } from "framer-motion";
import { Check, Star, Zap, Crown } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Free Forever",
    price: "₹0",
    period: "always free",
    highlight: true,
    icon: Star,
    features: [
      "Complete Vedic Birth Chart",
      "All 9 Planet Positions & Dignity",
      "Nakshatra, Gana, Nadi Analysis",
      "Full Vimshottari Dasha Timeline",
      "Manglik & Dosha Detection",
      "Daily Horoscope (All Signs)",
      "Zodiac Compatibility",
      "All Calculators & Tools",
    ],
    cta: "Generate Free Kundali",
    href: "/kundali",
  },
  {
    name: "PDF Report",
    price: "₹19",
    originalPrice: "₹99",
    period: "one-time",
    highlight: false,
    icon: Zap,
    features: [
      "Everything shown on screen",
      "Branded PDF Download",
      "Shareable with family",
      "Print-ready format",
      "Offline access forever",
    ],
    cta: "Download PDF — ₹19",
    href: "/kundali",
    savings: "80% OFF",
  },
  {
    name: "Matching Report",
    price: "₹19",
    originalPrice: "₹99",
    period: "per report",
    highlight: false,
    icon: Crown,
    features: [
      "36-Point Ashtakoot Matching",
      "Manglik Dosha Check (Both)",
      "Compatibility Score & Analysis",
      "PDF Download",
      "Remedies for Low Score",
    ],
    cta: "Try Matching Free",
    href: "/matching",
    savings: "80% OFF",
  },
];

export function PricingSection() {
  return (
    <section className="py-20" id="pricing">
      <div className="section-container">
        <h2 className="font-sora font-bold text-3xl sm:text-4xl text-center mb-3">
          <span className="gold-text">100% Free Kundali</span>
        </h2>
        <p className="text-center text-[var(--text-muted)] mb-4 max-w-xl mx-auto">
          Full Vedic birth chart — completely free, no sign-up needed. Pay only if you want a PDF.
        </p>
        <p className="text-center text-xs text-gold-400 mb-12">
          🔥 Over 10,000+ kundalis generated — trusted by thousands across India
        </p>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-6 border transition-all relative ${
                plan.highlight
                  ? "border-gold-400/60 bg-gold-400/5 shadow-glow"
                  : "glass-card"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-400 text-black text-xs font-bold px-4 py-1 rounded-full">
                  100% FREE
                </div>
              )}
              {plan.savings && (
                <div className="text-xs font-semibold text-mystic-green bg-mystic-green/10 px-3 py-1 rounded-full inline-block mb-3">
                  {plan.savings}
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <plan.icon className={`w-5 h-5 ${plan.highlight ? "text-gold-400" : "text-[var(--text-muted)]"}`} />
                <h3 className="font-sora font-bold text-xl text-white">{plan.name}</h3>
              </div>
              <div className="mt-2 mb-5">
                {plan.originalPrice && (
                  <span className="text-lg text-[var(--text-muted)] line-through mr-2">{plan.originalPrice}</span>
                )}
                <span className="text-3xl font-bold gold-text">{plan.price}</span>
                <span className="text-sm text-[var(--text-muted)] ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <Check className="w-4 h-4 text-mystic-green mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href}
                className={`block text-center py-3 rounded-xl font-semibold text-sm transition ${
                  plan.highlight
                    ? "gold-btn shadow-glow"
                    : "border border-gold-400/30 text-gold-400 hover:bg-gold-400/10"
                }`}>
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1">🔒 Secure Payment</span>
          <span className="flex items-center gap-1">⚡ Instant PDF Delivery</span>
          <span className="flex items-center gap-1">💯 No Sign-Up Required</span>
          <span className="flex items-center gap-1">📱 Works on All Devices</span>
        </div>
      </div>
    </section>
  );
}
