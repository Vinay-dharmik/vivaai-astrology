import { seoMeta } from "@/lib/seo/metadata";
import { HeroSection } from "@/components/home/HeroSection";
import { ZodiacSection } from "@/components/home/ZodiacSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { MethodologySection } from "@/components/home/MethodologySection";
import { PricingSection } from "@/components/home/PricingSection";
import { FAQSection } from "@/components/home/FAQSection";
import { RelatedTools } from "@/components/ui/RelatedTools";

export const metadata = seoMeta({
  title: "VivaAI Astrology — Free Vedic Kundali, Horoscope & Birth Chart",
  description:
    "Generate a free Vedic Kundali with your Lagna, Nakshatra, Vimshottari Dasha and classical remedies. Daily horoscope, Ashtakoot matching, zodiac compatibility and Panchang — calculated from Meeus astronomical algorithms with the Lahiri Ayanamsa. No sign-up.",
  path: "/",
  keywords: [
    "free kundali online", "vedic birth chart generator", "janam kundali",
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
      <MethodologySection />
      <PricingSection />
      <FAQSection />
      <div className="section-container pb-12">
        <RelatedTools currentPath="/" />
      </div>
    </>
  );
}
