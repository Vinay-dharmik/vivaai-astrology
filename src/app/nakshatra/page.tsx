import Link from "next/link";
import { seoMeta } from "@/lib/seo/metadata";
import { NAKSHATRAS, NAK_LORDS } from "@/lib/astrology/constants";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InArticleAd } from "@/components/ui/AdBanner";

export const metadata = seoMeta({
  title: "27 Nakshatras — Complete Vedic Star Guide",
  description: "Explore all 27 Nakshatras with detailed personality traits, deity, ruling planet, compatibility & career guidance for each birth star.",
  path: "/nakshatra",
});

export default function NakshatraPage() {
  return (
    <div className="section-container py-12">
      <Breadcrumb items={[{ label: "27 Nakshatras" }]} />
      <div className="text-center mb-10">
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">27 Nakshatras</h1>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">
          The 27 lunar mansions of Vedic astrology. Discover your Nakshatra&apos;s personality, strengths, and life path.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
        {NAKSHATRAS.map((nak, i) => (
          <Link key={nak} href={`/nakshatra/${nak.toLowerCase().replace(/\s+/g, "-")}`}
            className="glass-card p-4 text-center group hover:border-gold-400/40 transition-all hover:-translate-y-1">
            <div className="text-2xl mb-1">⭐</div>
            <h2 className="font-semibold text-sm text-white group-hover:text-gold-400 transition">{nak}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">Lord: {NAK_LORDS[i]}</p>
            <p className="text-xs text-gold-400/60">#{i + 1}</p>
          </Link>
        ))}
      </div>
      <InArticleAd />
    </div>
  );
}
