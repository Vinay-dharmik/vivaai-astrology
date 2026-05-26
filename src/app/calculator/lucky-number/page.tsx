import { seoMeta } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InArticleAd } from "@/components/ui/AdBanner";
import LuckyNumberClient from "./LuckyNumberClient";

export const metadata = seoMeta({
  title: "Lucky Number Today — Free Daily Lucky Number Calculator",
  description: "Find your lucky number for today based on your date of birth and Vedic numerology. Free daily lucky number, color, and direction prediction.",
  path: "/calculator/lucky-number",
});

export default function LuckyNumberPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lucky Number Calculator — VivaAI",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description: "Find your lucky number for today based on Vedic numerology and birth date analysis.",
  };

  return (
    <div className="section-container py-12 max-w-2xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb items={[{ label: "Calculators", href: "/calculator" }, { label: "Lucky Number" }]} />
      <div className="text-center mb-8">
        <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-2">Vedic Numerology</p>
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">Lucky Number Today</h1>
        <p className="text-[var(--text-muted)]">Discover your lucky number, color &amp; direction based on your birth date.</p>
      </div>
      <LuckyNumberClient />
      <InArticleAd />
    </div>
  );
}
