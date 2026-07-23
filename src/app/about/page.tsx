import { seoMeta } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Star, Shield, Eye, Heart, Zap, Globe, Users, Award } from "lucide-react";
import Link from "next/link";

export const metadata = seoMeta({
  title: "About VivaAI Astrology — Our Mission, Technology & Values",
  path: "/about",
  description: "Learn about VivaAI Astrology — India's AI-powered Vedic astrology platform. Discover our mission, technology, team, and how we blend ancient Vedic wisdom with modern astronomical precision.",
});

export default function AboutPage() {
  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: "About Us" }]} />
      <h1 className="font-sora font-bold text-3xl sm:text-4xl gold-text mb-2">About VivaAI Astrology</h1>
      <p className="text-[var(--text-muted)] mb-8">Where ancient Vedic wisdom meets modern technology.</p>

      {/* Our Story */}
      <div className="glass-card p-6 sm:p-8 space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm mb-8">
        <h2 className="text-xl font-sora font-bold text-gold-200">Our Story</h2>
        <p>
          <strong className="text-white">VivaAI Astrology</strong> was born from a simple observation: millions of people across India rely on Vedic astrology for important life decisions — from choosing wedding dates to understanding career paths — yet access to <em>accurate</em>, <em>affordable</em> astrology remained limited to those who could afford personal consultations with experienced astrologers.
        </p>
        <p>
          We set out to change this by building a platform that combines the <strong className="text-gold-200">precision of modern astronomical computation</strong> with the <strong className="text-gold-200">wisdom of traditional Vedic interpretation</strong>. Our goal was not to replace the human astrologer but to democratize access to the foundational calculations and insights that form the basis of every astrological reading — the birth chart itself, planetary positions, Dasha timelines, Dosha analysis, and compatibility matching.
        </p>
        <p>
          Today, VivaAI serves <strong className="text-white">thousands of users across India</strong> with free and premium Vedic astrology tools. From students checking their birth charts for the first time to families performing Kundali matching before marriage, our platform makes authentic Vedic astrology accessible to everyone, regardless of location or budget.
        </p>
      </div>

      {/* Our Approach */}
      <div className="glass-card p-6 sm:p-8 space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm mb-8">
        <h2 className="text-xl font-sora font-bold text-gold-200">Our Approach: Ancient Wisdom, Modern Precision</h2>
        <p>
          Vedic astrology (Jyotish Shastra) is one of the six Vedangas — auxiliary disciplines of the Vedas dating back over 5,000 years. It is not mere superstition; at its core, it is an intricate system of astronomical observation, mathematical calculation, and pattern recognition refined over millennia by generations of scholars.
        </p>
        <p>
          At VivaAI, we honor this tradition by ensuring our calculations are <strong className="text-white">astronomically precise</strong> while our interpretations follow <strong className="text-gold-200">classical Vedic principles</strong>. We do not invent new astrological systems or make unfounded claims. Every prediction, every Dosha analysis, and every remedy suggestion traces back to established texts like <em>Brihat Parashara Hora Shastra</em>, <em>Phaladeepika</em>, and <em>Saravali</em>.
        </p>
        <p>
          Where modern technology adds value, we embrace it. Our astronomical calculations use the <strong className="text-white">Astronomy Engine</strong> library — the same orbital mechanics models used by observatories and space agencies — ensuring that planetary positions in your birth chart are accurate to fractions of a degree. We apply the <strong className="text-gold-200">Lahiri Ayanamsa</strong>, recommended by the Indian government&apos;s Calendar Reform Committee, for sidereal conversion.
        </p>
      </div>

      {/* Our Values */}
      <div className="mb-8">
        <h2 className="text-xl font-sora font-bold text-gold-200 mb-4">Our Values</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: Star, title: "Accuracy First", desc: "Every calculation uses Astronomy Engine with Lahiri Ayanamsa. We match professional software to within 0.01° accuracy. No shortcuts, no approximations." },
            { icon: Globe, title: "Accessible to All", desc: "Core astrology tools are free forever — no sign-up walls, no hidden fees. We believe everyone deserves access to their own birth chart." },
            { icon: Shield, title: "Privacy by Design", desc: "Birth details are processed in your browser. We don't store personal astrological data on our servers. Your cosmic blueprint stays yours." },
            { icon: Eye, title: "Transparency", desc: "We clearly state our methodology, limitations, and the entertainment-purpose nature of astrological predictions. No misleading claims." },
            { icon: Heart, title: "Respect for Tradition", desc: "We follow classical Vedic astrology texts faithfully. Our interpretations are rooted in Parashara, not invented or sensationalized for clicks." },
            { icon: Zap, title: "Continuous Innovation", desc: "We are actively developing AI-enhanced interpretations that combine traditional rules with modern language models for more personalized, nuanced insights." },
          ].map((val) => (
            <div key={val.title} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gold-400/10 flex items-center justify-center shrink-0">
                  <val.icon className="w-4 h-4 text-gold-400" />
                </div>
                <h3 className="font-semibold text-white text-sm">{val.title}</h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What We Offer */}
      <div className="glass-card p-6 sm:p-8 space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm mb-8">
        <h2 className="text-xl font-sora font-bold text-gold-200">What We Offer</h2>
        <p>
          VivaAI provides a comprehensive suite of <strong className="text-white">14 free Vedic astrology tools</strong> covering every aspect of Jyotish analysis:
        </p>
        <ul className="space-y-2 list-disc pl-5">
          <li><strong className="text-white">Kundali Generator</strong> — Complete Vedic birth chart with Lagna, Moon sign, Nakshatra, all 9 planetary positions, Dosha detection, Yoga identification, and Vimshottari Dasha timeline.</li>
          <li><strong className="text-white">Kundali Matching</strong> — 36-point Ashtakoot compatibility analysis with Manglik Dosha check for marriage decisions.</li>
          <li><strong className="text-white">Daily Horoscope</strong> — Transit-based daily predictions for all 12 zodiac signs.</li>
          <li><strong className="text-white">Daily Panchang</strong> — Complete Hindu calendar with Tithi, Nakshatra, Yoga, Karana, and Rahu Kalam.</li>
          <li><strong className="text-white">Nakshatra Analysis</strong> — Detailed guides for all 27 lunar mansions with personality, compatibility, and career insights.</li>
          <li><strong className="text-white">Numerology, Remedies, Compatibility</strong> — And 8 more specialized tools for every astrological need.</li>
        </ul>
        <p>
          We also maintain an <Link href="/blog" className="text-gold-400 hover:underline">astrology blog</Link> of hand-written long-form guides covering topics from beginner explanations of the birth chart to advanced Dasha analysis, so our users have the educational resources to understand and benefit from their astrological insights. How those articles are written, sourced and reviewed is described in our <Link href="/editorial-policy" className="text-gold-400 hover:underline">editorial policy</Link>.
        </p>
      </div>

      {/* Our Team */}
      <div className="glass-card p-6 sm:p-8 space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm mb-8">
        <h2 className="text-xl font-sora font-bold text-gold-200 flex items-center gap-2">
          <Users className="w-5 h-5" /> Our Team
        </h2>
        <p>
          VivaAI is built by a dedicated team of <strong className="text-white">technology enthusiasts and astrology practitioners</strong> based in India. Our team combines expertise in full-stack web development, astronomical computation, data science, and traditional Vedic astrology.
        </p>
        <p>
          We are passionate about making authentic Vedic knowledge accessible through technology. Every feature we build is reviewed for both <strong className="text-gold-200">technical accuracy</strong> (astronomical calculations) and <strong className="text-gold-200">traditional fidelity</strong> (Vedic interpretation rules), ensuring our users receive the same quality of analysis they would expect from a skilled astrologer.
        </p>
      </div>

      {/* Trust Signals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Award, val: "9", label: "Grahas Computed" },
          { icon: Star, val: "27", label: "Nakshatras Covered" },
          { icon: Shield, val: "Lahiri", label: "Ayanamsa Standard" },
          { icon: Zap, val: "0.01°", label: "Calculation Precision" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <s.icon className="w-5 h-5 text-gold-400 mx-auto mb-2" />
            <div className="text-lg font-bold gold-text">{s.val}</div>
            <div className="text-xs text-[var(--text-muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center glass-card p-6">
        <h2 className="font-sora font-bold text-lg gold-text mb-2">Ready to Explore Your Stars?</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">Get your free Vedic birth chart with detailed analysis — no sign-up required.</p>
        <Link href="/kundali" className="gold-btn px-6 py-2 text-sm">Generate Free Kundali</Link>
      </div>
    </div>
  );
}
