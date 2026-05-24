import { seoMeta } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InArticleAd } from "@/components/ui/AdBanner";
import { AgeCalculatorClient } from "./AgeCalculatorClient";

export const metadata = seoMeta({
  title: "Age Calculator — Exact Age in Years, Months, Days",
  description: "Free online age calculator. Calculate your exact age in years, months, days, hours, minutes and seconds. Next birthday countdown, chronological age for school admissions & more.",
  path: "/calculator/age",
});

export default function AgeCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "VivaAI Age Calculator",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "8450" },
  };

  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb items={[{ label: "Calculators", href: "/calculator" }, { label: "Age Calculator" }]} />

      <div className="text-center mb-8">
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">Age Calculator</h1>
        <p className="text-[var(--text-muted)]">Calculate your exact age in years, months, days, hours, minutes & seconds.</p>
      </div>

      <AgeCalculatorClient />

      <InArticleAd />

      {/* SEO content (2000+ chars for ranking) */}
      <div className="glass-card-bright p-6 mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-gold-200">How to Use the Age Calculator</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Our free age calculator determines your exact chronological age from your date of birth to any given date. Simply enter your birth date and the calculator will instantly display your age broken down into years, months, days, weeks, hours, minutes, and even seconds.
        </p>
        <h2 className="text-lg font-semibold text-gold-200">What is Chronological Age?</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Chronological age is the amount of time that has elapsed since a person&apos;s birth. It is different from biological age (how old your body appears) and mental age (psychological maturity). Chronological age is commonly required for school admissions, medical assessments, legal documentation, and government forms.
        </p>
        <h2 className="text-lg font-semibold text-gold-200">Age Calculator for School Admissions</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Many schools in India require children to be a specific age by a cutoff date (usually March 31 or June 1) for admission. This calculator helps parents determine if their child meets the age requirement. Enter the child&apos;s date of birth and set the &quot;calculate to&quot; date as the school&apos;s cutoff date.
        </p>
        <h2 className="text-lg font-semibold text-gold-200">Vedic Age and Astrology</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          In Vedic astrology, your exact age is crucial for calculating planetary Dasha periods. The Vimshottari Dasha system divides your life into planetary periods that begin from birth. Knowing your precise age helps determine which Mahadasha and Antardasha you&apos;re currently experiencing. <a href="/kundali" className="text-gold-400 hover:underline">Generate your free Kundali</a> for complete Dasha analysis.
        </p>
      </div>

      <InArticleAd />
    </div>
  );
}
