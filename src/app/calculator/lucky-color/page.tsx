import { seoMeta } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InArticleAd } from "@/components/ui/AdBanner";
import LuckyColorClient from "./LuckyColorClient";

export const metadata = seoMeta({
  title: "Lucky Color Today — Daily Color Prediction by Zodiac",
  description: "Find your lucky color for today based on your zodiac sign and Vedic astrology. Free daily lucky color, gemstone, and metal prediction for all 12 signs.",
  path: "/calculator/lucky-color",
});

export default function LuckyColorPage() {
  return (
    <div className="section-container py-12 max-w-2xl mx-auto">
      <Breadcrumb items={[{ label: "Calculators", href: "/calculator" }, { label: "Lucky Color" }]} />
      <div className="text-center mb-8">
        <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-2">Vedic Color Therapy</p>
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">Lucky Color Today</h1>
        <p className="text-[var(--text-muted)]">Discover your lucky color based on your zodiac sign and today&apos;s planetary ruler.</p>
      </div>
      <LuckyColorClient />
      <InArticleAd />
    </div>
  );
}
