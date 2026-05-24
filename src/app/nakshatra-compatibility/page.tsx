import { seoMeta } from "@/lib/seo/metadata";
import { NAKSHATRAS } from "@/lib/astrology/constants";
import { slugify } from "@/lib/astrology/nakshatraCompat";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InArticleAd } from "@/components/ui/AdBanner";
import Link from "next/link";

export const metadata = seoMeta({
  title: "Nakshatra Compatibility Chart — 729 Combinations",
  description: "Complete Nakshatra compatibility chart for marriage. Check compatibility between all 27 Nakshatras with Gana, Yoni, Nadi & planetary lord matching. Free Vedic analysis.",
  path: "/nakshatra-compatibility",
});

export default function NakshatraCompatIndexPage() {
  return (
    <div className="section-container py-12">
      <Breadcrumb items={[{ label: "Nakshatra", href: "/nakshatra" }, { label: "Compatibility" }]} />

      <div className="text-center mb-10">
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">
          Nakshatra Compatibility Chart
        </h1>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">
          Check compatibility between all 27 Nakshatras. Select your birth star and your partner&apos;s star for detailed marriage compatibility analysis.
        </p>
      </div>

      <InArticleAd />

      <div className="overflow-x-auto">
        <p className="text-xs text-[var(--text-muted)] mb-4 text-center">Click any Nakshatra below to see compatibility with all 27 stars</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
          {NAKSHATRAS.map((nak, i) => (
            <Link key={nak} href={`/nakshatra-compatibility/${slugify(nak)}-and-${slugify(NAKSHATRAS[(i + 1) % 27])}`}
              className="glass-card p-4 text-center group hover:border-gold-400/40 transition-all hover:-translate-y-1">
              <div className="text-2xl mb-1">⭐</div>
              <h2 className="font-semibold text-sm text-white group-hover:text-gold-400 transition">{nak}</h2>
              <p className="text-xs text-gold-400/60 mt-1">Check Compatibility →</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular combos for internal linking */}
      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-sm font-semibold text-gold-200 uppercase tracking-wider mb-4 text-center">Popular Compatibility Checks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            ["Ashwini","Bharani"],["Rohini","Mrigashira"],["Magha","Uttara Phalguni"],
            ["Hasta","Chitra"],["Swati","Vishakha"],["Anuradha","Jyeshtha"],
            ["Shravana","Dhanishta"],["Pushya","Ashlesha"],["Revati","Ashwini"],
          ].map(([a,b]) => (
            <Link key={`${a}-${b}`} href={`/nakshatra-compatibility/${slugify(a)}-and-${slugify(b)}`}
              className="text-xs text-[var(--text-secondary)] hover:text-gold-400 transition py-2 px-3 bg-white/[0.02] rounded-lg text-center">
              {a} & {b}
            </Link>
          ))}
        </div>
      </div>

      <InArticleAd />
    </div>
  );
}
