import { seoMeta } from "@/lib/seo/metadata";
import { MatchingForm } from "@/components/matching/MatchingForm";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata = seoMeta({
  title: "Free Kundali Matching — Ashtakoot Guna Score",
  description: "Free Kundali matching with 36-point Ashtakoot guna analysis. Check marriage compatibility, Manglik dosha & relationship insights instantly.",
  path: "/matching",
});

export default function MatchingPage() {
  return (
    <div className="section-container py-12">
      <Breadcrumb items={[{ label: "Kundali Matching" }]} />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-2">Marriage Compatibility</p>
          <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">
            Kundali Matching
          </h1>
          <p className="text-[var(--text-muted)]">
            Enter birth details of both partners for Ashtakoot guna matching with 36-point analysis.
          </p>
        </div>
        <MatchingForm />
      </div>
    </div>
  );
}
