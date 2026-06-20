import { seoMeta } from "@/lib/seo/metadata";
import { HeroSection } from "@/components/home/HeroSection";
import { ZodiacSection } from "@/components/home/ZodiacSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { PricingSection } from "@/components/home/PricingSection";
import { FAQSection } from "@/components/home/FAQSection";
import { RelatedTools } from "@/components/ui/RelatedTools";

export const metadata = seoMeta({
  title: "VivaAI Astrology — Free Vedic Kundali, Horoscope & AI Predictions",
  description:
    "Get your free AI-powered Vedic Kundali with accurate Lagna, Nakshatra, Dasha & remedies. Daily horoscope, kundali matching, zodiac compatibility & personalized astrology insights at vivaai.in. Trusted by thousands across India.",
  path: "/",
  keywords: [
    "free kundali online", "vedic birth chart generator", "AI astrology predictions",
    "daily horoscope today", "kundali matching for marriage", "nakshatra finder",
    "zodiac sign compatibility", "panchang today", "mangal dosha calculator",
    "numerology calculator", "janam patri online free", "vedic jyotish",
    "moon sign calculator", "rashi calculator", "horoscope 2026",
  ],
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ZodiacSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <div className="section-container pb-12">
        <RelatedTools currentPath="/" />
      </div>
    </>
  );
}
