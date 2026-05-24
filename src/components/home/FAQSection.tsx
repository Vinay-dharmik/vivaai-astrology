"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is the Kundali generator really free?",
    a: "Yes! The basic Kundali report is 100% free with no sign-up. You get your Lagna, Moon sign, Nakshatra, Dasha period, and a preview of planetary positions. For the complete detailed report with Dosha analysis, Yoga detection, life predictions, gemstones, remedies, and a downloadable PDF — it's just ₹49 (75% off from ₹199 for a limited time).",
  },
  {
    q: "How accurate are the calculations?",
    a: "We use the industry-standard Lahiri Ayanamsa with the Astronomy Engine library for high-precision planetary calculations. The same mathematical models used by professional astrology software. Our calculations match leading platforms like AstroSage and Kundli Software to within 0.01° accuracy.",
  },
  {
    q: "What is Ashtakoot matching? How does it work?",
    a: "Ashtakoot matching evaluates marriage compatibility using 8 aspects (koots): Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi — totaling 36 points. A score above 18 is acceptable, 25+ is excellent. We also check Manglik Dosha separately.",
  },
  {
    q: "What is a Dosha? Should I worry about Manglik Dosha?",
    a: "A Dosha is a planetary affliction in your birth chart. Manglik Dosha occurs when Mars is in houses 1, 2, 4, 7, 8, or 12. It's not always negative — many cancellation conditions exist. Use our free Kundali generator to check your Dosha status with detailed analysis.",
  },
  {
    q: "How is the daily Panchang calculated?",
    a: "Our Panchang calculates Tithi, Nakshatra, Yoga, Karana, and Rahu Kalam using lunar phase calculations. It includes auspicious/inauspicious timings for any date. Useful for planning pujas, ceremonies, and important events.",
  },
  {
    q: "Can I use this for marriage decisions?",
    a: "Our Kundali matching provides the same Ashtakoot analysis used by professional astrologers. However, for major life decisions like marriage, we recommend consulting a qualified Vedic astrologer who can consider your complete birth charts in depth.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We use Razorpay, India's leading payment gateway. You can pay via UPI (Google Pay, PhonePe, Paytm), credit/debit cards, net banking, and popular wallets. The payment is secure, instant, and your premium report is delivered immediately.",
  },
  {
    q: "Do you use AI or rule-based astrology?",
    a: "Currently, all interpretations use traditional Vedic astrology rules implemented in code — the same rules used by astrologers for thousands of years. We're developing AI-enhanced interpretations that will combine traditional rules with modern AI for even more personalized insights.",
  },
];

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="section-container max-w-3xl">
        <h2 className="font-sora font-bold text-3xl sm:text-4xl text-center mb-3 gold-text">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-[var(--text-muted)] mb-10">
          Everything you need to know about our astrology platform.
        </p>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left group"
              >
                <span className="font-medium text-sm text-white group-hover:text-gold-400 transition pr-4">
                  {faq.q}
                </span>
                <ChevronDown className={`w-4 h-4 text-gold-400 transition-transform shrink-0 ${openIdx === i ? "rotate-180" : ""}`} />
              </button>
              {openIdx === i && (
                <div className="px-4 pb-4 border-t border-[var(--border)]">
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
