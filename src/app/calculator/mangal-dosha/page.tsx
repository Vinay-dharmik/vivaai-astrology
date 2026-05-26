import { seoMeta } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InArticleAd } from "@/components/ui/AdBanner";
import MangalDoshaClient from "./MangalDoshaClient";

export const metadata = seoMeta({
  title: "Mangal Dosha Checker — Free Manglik Test Online",
  description: "Check Mangal Dosha (Manglik) online free. Enter birth details to find if you have Manglik Dosha, its severity, cancellation conditions & effective remedies.",
  path: "/calculator/mangal-dosha",
});

export default function MangalDoshaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Mangal Dosha Checker — VivaAI",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.7", ratingCount: "5800" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What is Mangal Dosha?", acceptedAnswer: { "@type": "Answer", text: "Mangal Dosha (Manglik Dosha) occurs when Mars is placed in the 1st, 4th, 7th, 8th, or 12th house from Lagna, Moon, or Venus. It affects marriage compatibility." } },
      { "@type": "Question", name: "Can Mangal Dosha be cancelled?", acceptedAnswer: { "@type": "Answer", text: "Yes. Mars in its own sign, exalted, or aspected by benefics like Jupiter cancels the dosha. Two Manglik partners also neutralize the effect." } },
      { "@type": "Question", name: "Does Mangal Dosha go away after 28?", acceptedAnswer: { "@type": "Answer", text: "Some traditions say the intensity reduces after age 28 as Mars matures, but the dosha technically remains in the birth chart permanently." } },
    ],
  };

  return (
    <div className="section-container py-12 max-w-2xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumb items={[{ label: "Calculators", href: "/calculator" }, { label: "Mangal Dosha" }]} />
      <div className="text-center mb-8">
        <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-2">Vedic Dosha Analysis</p>
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">Mangal Dosha Checker</h1>
        <p className="text-[var(--text-muted)]">Check if you have Manglik Dosha, its severity &amp; remedies.</p>
      </div>
      <MangalDoshaClient />
      <InArticleAd />
      {/* FAQ for SEO */}
      <div className="mt-10 space-y-4">
        <h2 className="font-sora font-bold text-lg gold-text text-center mb-4">Frequently Asked Questions</h2>
        {[
          { q: "What is Mangal Dosha?", a: "Mangal Dosha occurs when Mars is in the 1st, 4th, 7th, 8th, or 12th house from Lagna, Moon, or Venus. It primarily affects marriage and relationships." },
          { q: "Can Mangal Dosha be cancelled?", a: "Yes — Mars in its own sign, exalted, or aspected by Jupiter can cancel the dosha. When both partners are Manglik, the effects neutralize." },
          { q: "What are effective remedies?", a: "Remedies include Mangal Shanti Puja, wearing Red Coral, chanting Hanuman Chalisa, and marrying after Kumbh Vivah ceremony." },
        ].map(f => (
          <div key={f.q} className="glass-card p-5">
            <h3 className="font-semibold text-sm text-white mb-2">{f.q}</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
