import { seoMeta } from "@/lib/seo/metadata";
import { PanchangDisplay } from "@/components/calculators/PanchangDisplay";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InArticleAd } from "@/components/ui/AdBanner";

export const metadata = seoMeta({
  title: "Today's Panchang — Hindu Calendar & Muhurat",
  description: "Free daily Panchang with Tithi, Nakshatra, Yoga, Karana, Rahu Kalam & auspicious timings. Check today's Hindu calendar for festivals & muhurats.",
  path: "/panchang",
});

export default function PanchangPage() {
  return (
    <div className="section-container py-12 max-w-2xl mx-auto">
      <Breadcrumb items={[{ label: "Daily Panchang" }]} />
      <div className="text-center mb-8">
        <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-2">Hindu Calendar</p>
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">Daily Panchang</h1>
        <p className="text-[var(--text-muted)]">
          Check Tithi, Nakshatra, Yoga, Karana & auspicious timings for any date.
        </p>
      </div>
      <PanchangDisplay />
      <InArticleAd />
    </div>
  );
}
