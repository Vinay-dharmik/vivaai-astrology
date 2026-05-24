import { seoMeta } from "@/lib/seo/metadata";
import Link from "next/link";
import { ZODIAC_INFO } from "@/lib/astrology/constants";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata = seoMeta({
  title: "Zodiac Compatibility Chart — All 144 Combinations",
  description: "Check zodiac compatibility for all 144 sign combinations. Free love, friendship & marriage compatibility analysis for every zodiac pairing.",
  path: "/compatibility",
});

const SIGNS = Object.keys(ZODIAC_INFO);
const SYMBOLS: Record<string, string> = {
  aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋", leo: "♌", virgo: "♍",
  libra: "♎", scorpio: "♏", sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓",
};

export default function CompatibilityPage() {
  return (
    <div className="section-container py-12">
      <Breadcrumb items={[{ label: "Zodiac Compatibility" }]} />
      <div className="text-center mb-10">
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">Zodiac Compatibility</h1>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">
          Explore love, friendship & marriage compatibility for all 144 zodiac sign combinations.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
        {SIGNS.map((sign) => (
          <Link key={sign} href={`/compatibility/${sign}`}
            className="glass-card p-4 text-center group hover:border-gold-400/40 transition-all hover:-translate-y-1">
            <div className="text-3xl mb-2">{SYMBOLS[sign]}</div>
            <h2 className="font-semibold text-sm capitalize text-white group-hover:text-gold-400 transition">{sign}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">with all signs →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
