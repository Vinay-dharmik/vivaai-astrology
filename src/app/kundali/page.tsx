import { seoMeta } from "@/lib/seo/metadata";
import { KundaliForm } from "@/components/kundali/KundaliForm";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata = seoMeta({
  title: "Free Kundali Generator — Vedic Birth Chart",
  description: "Generate your free Vedic Kundali instantly. Accurate Lagna, Moon sign, Nakshatra, planetary positions, Vimshottari Dasha & AI interpretations.",
  path: "/kundali",
});

export default function KundaliPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "VivaAI Free Kundali Generator",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "12400" },
    description: "Free Vedic Kundali with Lagna, Nakshatra, Dasha, Doshas, Yogas & AI predictions.",
  };

  return (
    <div className="section-container py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb items={[{ label: "Free Kundali" }]} />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-2">Vedic Astrology</p>
          <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">
            Free Kundali Generator
          </h1>
          <p className="text-[var(--text-muted)]">
            Enter your birth details for an accurate Vedic birth chart with AI-powered insights.
          </p>
        </div>
        <KundaliForm />
      </div>
    </div>
  );
}
