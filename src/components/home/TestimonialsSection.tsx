"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Priya S.",
    location: "Mumbai",
    text: "The Kundali report was incredibly detailed! My Manglik Dosha analysis matched exactly what my family astrologer told me. Saved ₹500 compared to in-person consultation.",
    rating: 5,
    feature: "Kundali Report",
  },
  {
    name: "Rahul K.",
    location: "Delhi",
    text: "Used the matching feature before my wedding. 28/36 guna score gave my parents confidence. The dosha check was very thorough.",
    rating: 5,
    feature: "Kundali Matching",
  },
  {
    name: "Anita M.",
    location: "Bangalore",
    text: "I check my daily horoscope here every morning. The predictions feel personalized and the remedies actually helped my career situation.",
    rating: 4,
    feature: "Daily Horoscope",
  },
  {
    name: "Vikram P.",
    location: "Pune",
    text: "The PDF report is professional quality. I shared it with my astrologer and he was impressed by the accuracy of planetary positions.",
    rating: 5,
    feature: "Premium PDF",
  },
  {
    name: "Sneha D.",
    location: "Hyderabad",
    text: "Best free astrology tool I've found. The nakshatra analysis was spot-on about my personality. Premium report was totally worth ₹49.",
    rating: 5,
    feature: "Nakshatra",
  },
  {
    name: "Amit R.",
    location: "Jaipur",
    text: "Finally an astrology site that doesn't spam you! Clean, fast, and accurate. The gemstone recommendations were exactly what I needed.",
    rating: 5,
    feature: "Remedies",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="section-container">
        <h2 className="font-sora font-bold text-3xl sm:text-4xl text-center mb-3">
          <span className="gold-text">Trusted by Thousands</span>
        </h2>
        <p className="text-center text-[var(--text-muted)] mb-12 max-w-xl mx-auto">
          Real experiences from our community across India.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s < t.rating ? "text-gold-400 fill-gold-400" : "text-[var(--border)]"}`} />
                ))}
              </div>

              <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1 mb-4">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">{t.location}</div>
                </div>
                <span className="text-[0.6rem] px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 font-medium">
                  {t.feature}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
