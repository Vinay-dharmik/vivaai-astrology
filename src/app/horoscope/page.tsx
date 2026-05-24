import Link from "next/link";
import { seoMeta } from "@/lib/seo/metadata";
import { ZODIAC_INFO } from "@/lib/astrology/constants";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InArticleAd } from "@/components/ui/AdBanner";

export const metadata = seoMeta({
  title: "Daily Horoscope — All 12 Zodiac Signs",
  description: "Free daily, weekly, monthly and yearly horoscope for all 12 zodiac signs. AI-powered astrology predictions.",
  path: "/horoscope",
});

const SYMBOLS: Record<string, string> = {
  aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋", leo: "♌", virgo: "♍",
  libra: "♎", scorpio: "♏", sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓",
};

export default function HoroscopePage() {
  return (
    <div className="section-container py-12">
      <Breadcrumb items={[{ label: "Daily Horoscope" }]} />
      <div className="text-center mb-10">
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">Daily Horoscope</h1>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">
          Select your zodiac sign for today&apos;s horoscope prediction.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {Object.entries(ZODIAC_INFO).map(([key, info]) => (
          <Link key={key} href={`/horoscope/${key}`}
            className="glass-card p-6 text-center group hover:border-gold-400/50 transition-all hover:-translate-y-1">
            <div className="text-4xl mb-3">{SYMBOLS[key]}</div>
            <h2 className="font-semibold capitalize text-white group-hover:text-gold-400 transition">{key}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">{info.dates}</p>
            <p className="text-xs text-gold-400/70 mt-2">{info.trait}</p>
          </Link>
        ))}
      </div>
      <InArticleAd />
    </div>
  );
}
