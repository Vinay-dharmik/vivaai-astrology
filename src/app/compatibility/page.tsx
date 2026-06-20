import { seoMeta } from "@/lib/seo/metadata";
import Link from "next/link";
import { ZODIAC_INFO } from "@/lib/astrology/constants";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { RelatedTools } from "@/components/ui/RelatedTools";
import { InArticleAd } from "@/components/ui/AdBanner";

export const metadata = seoMeta({
  title: "Zodiac Compatibility Chart — All 144 Combinations | Vedic Astrology",
  description: "Check zodiac compatibility for all 144 sign combinations. Free love, friendship & marriage compatibility analysis based on Vedic astrology elements, ruling planets & temperament matching.",
  path: "/compatibility",
  keywords: [
    "zodiac compatibility", "zodiac sign compatibility", "love compatibility",
    "relationship compatibility chart", "best zodiac match", "astrology compatibility",
    "aries compatibility", "sign matching", "zodiac love match",
  ],
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
      <InArticleAd />

      {/* Educational Content */}
      <div className="max-w-3xl mx-auto mt-16 space-y-12">
        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">Understanding Zodiac Compatibility in Vedic Astrology</h2>
          <div className="glass-card-bright p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              <strong className="text-white">Zodiac compatibility</strong> in Vedic astrology examines how two individuals&apos; birth chart energies interact based on their zodiac signs, ruling planets, and elemental natures. Unlike Western compatibility which focuses on Sun signs, Vedic compatibility emphasizes the <strong className="text-gold-200">Moon sign relationship</strong> between partners, as the Moon governs emotions, mental harmony, and the inner world of relationships.
            </p>
            <p>
              The 12 zodiac signs are grouped into four elements — <strong className="text-white">Fire</strong> (Aries, Leo, Sagittarius), <strong className="text-white">Earth</strong> (Taurus, Virgo, Capricorn), <strong className="text-white">Air</strong> (Gemini, Libra, Aquarius), and <strong className="text-white">Water</strong> (Cancer, Scorpio, Pisces). Signs sharing the same element naturally understand each other, while complementary elements (Fire-Air, Earth-Water) create dynamic, stimulating partnerships.
            </p>
            <p>
              Each sign is also classified by modality — <em>Cardinal</em> (initiators), <em>Fixed</em> (stabilizers), or <em>Mutable</em> (adapters) — and by ruling planet. The friendship or enmity between ruling planets significantly impacts compatibility. For example, Sun-ruled Leo and Moon-ruled Cancer share a natural friendship, while Sun-ruled Leo and Saturn-ruled Aquarius can face tension due to the Sun-Saturn opposition.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">Element Compatibility Guide</h2>
          <div className="glass-card-bright p-6 sm:p-8 text-sm text-[var(--text-secondary)] leading-relaxed">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { element: "🔥 Fire + Air", desc: "Dynamic, passionate, and intellectually stimulating. Fire's enthusiasm fuels Air's ideas. Best pairs: Aries-Gemini, Leo-Libra, Sagittarius-Aquarius." },
                { element: "🌍 Earth + Water", desc: "Stable, nurturing, and deeply emotional. Earth provides security while Water brings depth. Best pairs: Taurus-Cancer, Virgo-Scorpio, Capricorn-Pisces." },
                { element: "🔥 Fire + Fire", desc: "Exciting and passionate but potentially volatile. Both partners are energetic and action-oriented. Works when both respect each other's independence." },
                { element: "🌍 Earth + Earth", desc: "Highly stable and practical but may lack excitement. Both value security and material comfort. Works when both make effort to keep romance alive." },
              ].map((item) => (
                <div key={item.element} className="bg-white/[0.03] rounded-lg p-4">
                  <h3 className="font-semibold text-gold-200 mb-1.5">{item.element}</h3>
                  <p className="text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-sora font-bold text-2xl gold-text mb-4">Beyond Sun Sign Compatibility</h2>
          <div className="glass-card-bright p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              While zodiac sign compatibility provides valuable initial insights, Vedic astrology offers much deeper compatibility analysis methods for serious relationship decisions:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">Ashtakoot Matching (36 Points)</strong> — The gold standard for marriage compatibility, evaluating 8 dimensions including temperament, physical compatibility, and progeny. Try our <Link href="/matching" className="text-gold-400 hover:underline">free Kundali matching tool</Link>.</li>
              <li><strong className="text-white">Nakshatra Compatibility</strong> — Compares the 27 lunar mansions for 729 possible combinations, offering nuanced personality and energy matching. Explore our <Link href="/nakshatra-compatibility" className="text-gold-400 hover:underline">Nakshatra compatibility checker</Link>.</li>
              <li><strong className="text-white">7th House Analysis</strong> — Examining the marriage house in both birth charts reveals the nature of the partnership, timing of marriage, and characteristics of the ideal partner.</li>
            </ul>
            <p>
              For comprehensive compatibility insights, read our <Link href="/blog/zodiac-compatibility-guide" className="text-gold-400 hover:underline">zodiac compatibility guide</Link>.
            </p>
          </div>
        </section>

        <div className="pb-4">
          <RelatedTools currentPath="/compatibility" />
        </div>
      </div>
    </div>
  );
}
