"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Star, MessageCircle } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-20 left-[10%] w-72 h-72 bg-gold-400/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-mystic-purple/10 rounded-full blur-[120px]" />

      <div className="section-container text-center relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/5 mb-6">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-xs text-gold-200 tracking-wide uppercase">AI-Powered Vedic Astrology</span>
          </div>

          {/* Title */}
          <h1 className="font-sora font-extrabold text-4xl sm:text-5xl md:text-7xl leading-tight mb-6">
            <span className="gold-text">Your Stars.</span>
            <br />
            <span className="text-white">Your Destiny.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Get your <strong className="text-gold-400">free Vedic Kundali</strong> with accurate
            Lagna, Nakshatra, Dasha timeline & AI-powered life predictions.
            Trusted by thousands across India.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kundali"
              className="gold-btn text-lg px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 shadow-glow">
              <Star className="w-5 h-5" />
              Generate Free Kundali
            </Link>
            <Link href="/horoscope"
              className="glass-card px-8 py-4 rounded-xl text-gold-200 hover:text-gold-400 transition inline-flex items-center justify-center gap-2 text-lg font-semibold">
              <MessageCircle className="w-5 h-5" />
              Today&apos;s Horoscope
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[
            { val: "10K+", label: "Kundalis Generated" },
            { val: "12", label: "Zodiac Signs" },
            { val: "99%", label: "Accuracy" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gold-text">{s.val}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
