import { seoMeta } from "@/lib/seo/metadata";
import { RemediesForm } from "@/components/remedies/RemediesForm";

export const metadata = seoMeta({
  title: "Astrology Remedies — Gemstones, Mantras & Puja",
  description: "Free personalized Vedic astrology remedies. Gemstone suggestions, planet mantras, fasting days, lucky colors & donations based on your birth chart.",
  path: "/remedies",
});

export default function RemediesPage() {
  return (
    <div className="section-container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-2">Personalized Guidance</p>
          <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">
            Astrology Remedies
          </h1>
          <p className="text-[var(--text-muted)]">
            Enter your birth details for personalized gemstone, mantra & remedy recommendations.
          </p>
        </div>
        <RemediesForm />
      </div>
    </div>
  );
}
