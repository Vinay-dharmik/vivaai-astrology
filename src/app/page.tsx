import { HeroSection } from "@/components/home/HeroSection";
import { ZodiacSection } from "@/components/home/ZodiacSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { PricingSection } from "@/components/home/PricingSection";
import { FAQSection } from "@/components/home/FAQSection";
import { RelatedTools } from "@/components/ui/RelatedTools";

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
