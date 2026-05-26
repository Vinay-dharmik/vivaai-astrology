import { seoMeta } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InArticleAd } from "@/components/ui/AdBanner";
import MarriageAgeClient from "./MarriageAgeClient";

export const metadata = seoMeta({
  title: "Marriage Age Prediction — Free Vedic Marriage Timing Calculator",
  description: "Predict your marriage age using Vedic astrology. Free marriage timing calculator based on 7th house, Venus, Jupiter & Dasha analysis. Find when you will get married.",
  path: "/calculator/marriage-age",
});

export default function MarriageAgePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "Can astrology predict marriage age?", acceptedAnswer: { "@type": "Answer", text: "Vedic astrology analyzes the 7th house lord, Venus, Jupiter Dasha periods, and transits to estimate the most likely marriage age range. It provides a range, not an exact date." } },
      { "@type": "Question", name: "Which planet decides marriage timing?", acceptedAnswer: { "@type": "Answer", text: "Venus is the primary significator of marriage. Jupiter's transit over the 7th house and the Dasha of the 7th lord also trigger marriage events." } },
    ],
  };

  return (
    <div className="section-container py-12 max-w-2xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumb items={[{ label: "Calculators", href: "/calculator" }, { label: "Marriage Age" }]} />
      <div className="text-center mb-8">
        <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-2">Vedic Marriage Timing</p>
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">Marriage Age Prediction</h1>
        <p className="text-[var(--text-muted)]">Estimate your marriage age based on Vedic astrology principles.</p>
      </div>
      <MarriageAgeClient />
      <InArticleAd />
    </div>
  );
}
