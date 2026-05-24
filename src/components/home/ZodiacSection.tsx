"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ZODIAC_INFO } from "@/lib/astrology/constants";

const SIGNS = Object.entries(ZODIAC_INFO);

export function ZodiacSection() {
  return (
    <section className="py-20">
      <div className="section-container">
        <h2 className="font-sora font-bold text-3xl sm:text-4xl text-center mb-3">
          <span className="gold-text">12 Zodiac Signs</span>
        </h2>
        <p className="text-center text-[var(--text-muted)] mb-12 max-w-xl mx-auto">
          Explore daily horoscopes, traits, and predictions for your zodiac sign.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {SIGNS.map(([key, info], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/horoscope/${key}`}
                className="glass-card p-5 text-center block group hover:border-gold-400/50 transition-all hover:-translate-y-1">
                <div className="text-3xl mb-2">{getSymbol(key)}</div>
                <div className="font-semibold text-sm capitalize text-white group-hover:text-gold-400 transition">
                  {key}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{info.dates}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getSymbol(sign: string): string {
  const symbols: Record<string, string> = {
    aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋",
    leo: "♌", virgo: "♍", libra: "♎", scorpio: "♏",
    sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓",
  };
  return symbols[sign] || "✦";
}
