import { seoMeta } from "@/lib/seo/metadata";
import { NumerologyCalc } from "@/components/calculators/NumerologyCalc";

export const metadata = seoMeta({
  title: "Free Numerology Calculator — Life Path Number",
  description: "Calculate your Life Path, Expression, Soul Urge & Personality numbers free. Discover your numerology profile and life purpose.",
  path: "/calculator/numerology",
});

export default function NumerologyPage() {
  return (
    <div className="section-container py-12 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-2">Numerology</p>
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">
          Numerology Calculator
        </h1>
        <p className="text-[var(--text-muted)]">
          Discover your Life Path number and what it reveals about your destiny.
        </p>
      </div>
      <NumerologyCalc />
    </div>
  );
}
