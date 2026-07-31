import { notFound } from "next/navigation";
import { ZODIAC_INFO } from "@/lib/astrology/constants";
import { generateDailyHoroscope } from "@/lib/astrology/horoscope";
import { seoMeta } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ShareButtons } from "@/components/ui/ShareButtons";
import Link from "next/link";

const SYMBOLS: Record<string, string> = {
  aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋", leo: "♌", virgo: "♍",
  libra: "♎", scorpio: "♏", sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓",
};


interface PageProps {
  params: Promise<{ sign: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { sign } = await params;
  const info = ZODIAC_INFO[sign];
  if (!info) return {};
  return seoMeta({
    title: `${sign.charAt(0).toUpperCase() + sign.slice(1)} Horoscope Today — Daily Prediction`,
    description: `Free daily horoscope for ${sign}. ${info.trait}. ${info.dates}. Detailed predictions for love, career, health & finance.`,
    path: `/horoscope/${sign}`,
  });
}

export function generateStaticParams() {
  return Object.keys(ZODIAC_INFO).map((sign) => ({ sign }));
}

// The reading is computed from live planetary positions, so the page has to be
// rebuilt as the sky moves. Hourly keeps the Moon's sign change accurate.
export const revalidate = 3600;

export default async function ZodiacHoroscopePage({ params }: PageProps) {
  const { sign } = await params;
  const info = ZODIAC_INFO[sign];
  if (!info) notFound();

  const today = new Date();
  const isoDate = today.toISOString().split("T")[0];
  const dateStr = today.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const d = await generateDailyHoroscope(sign, today);
  const cap = sign.charAt(0).toUpperCase() + sign.slice(1);

  // Article schema with today's date drives freshness/repeat crawling
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${cap} Horoscope Today — ${dateStr}`,
    description: `Daily ${cap} horoscope predictions for love, career, health and finance. ${d.general}`,
    datePublished: isoDate,
    dateModified: isoDate,
    author: { "@type": "Organization", name: "VivaAI Astrology", url: "https://vivaai.in" },
    publisher: { "@type": "Organization", name: "VivaAI Astrology", url: "https://vivaai.in" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://vivaai.in/horoscope/${sign}` },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `What is the ${cap} horoscope for today?`, acceptedAnswer: { "@type": "Answer", text: d.general } },
      { "@type": "Question", name: `What is the lucky number for ${cap} today?`, acceptedAnswer: { "@type": "Answer", text: `Today's lucky number for ${cap} is ${d.luckyNumber} and the lucky color is ${d.luckyColor}.` } },
      { "@type": "Question", name: `Which planet rules ${cap}?`, acceptedAnswer: { "@type": "Answer", text: `${cap} is ruled by ${info.ruling}.` } },
    ],
  };

  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumb items={[{ label: "Horoscope", href: "/horoscope" }, { label: cap }]} />
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">{SYMBOLS[sign]}</div>
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text capitalize mb-2">
          {sign} Horoscope Today
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          <time dateTime={isoDate}>{dateStr}</time> • {info.dates}
        </p>
      </div>

      <div className="glass-card-bright p-6 sm:p-8 mb-6 space-y-6">
        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MiniCard label="Ruling Planet" value={info.ruling} />
          <MiniCard label="Lucky Number" value={String(d.luckyNumber)} />
          <MiniCard label="Lucky Color" value={d.luckyColor} />
          <MiniCard label="Mood" value={d.mood} />
        </div>

        {/* Main prediction */}
        <div>
          <h2 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-3">Today&apos;s Prediction</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-3">{d.general}</p>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Moon is in {d.moonSign} ({d.moonNakshatra} Nakshatra), the {d.moonHouse}
            {d.moonHouse === 1 ? "st" : d.moonHouse === 2 ? "nd" : d.moonHouse === 3 ? "rd" : "th"} house from {cap}.
            {d.retrogrades.length > 0 && ` Retrograde today: ${d.retrogrades.join(", ")}.`}
          </p>
        </div>

        {/* Category predictions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <CategoryCard emoji="💼" title="Career" text={d.career} score={d.careerScore} />
          <CategoryCard emoji="❤️" title="Love & Relationships" text={d.love} score={d.loveScore} />
          <CategoryCard emoji="🏥" title="Health & Wellness" text={d.health} score={d.healthScore} />
          <CategoryCard emoji="💰" title="Finance" text={d.finance} score={d.financeScore} />
        </div>

        {/* Where these predictions come from — the actual transits today */}
        <div className="pt-4 border-t border-[var(--border)]">
          <h2 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-3">
            Today&apos;s Transits from {cap}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mb-3">
            Sidereal positions (Lahiri Ayanamsa) for {dateStr}, with the bhava each graha
            occupies counted from {cap}. Every prediction above is derived from this table.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gold-200 border-b border-gold-400/20">
                  <th className="text-left py-2 pr-3 font-semibold">Graha</th>
                  <th className="text-left py-2 pr-3 font-semibold">Rashi</th>
                  <th className="text-left py-2 pr-3 font-semibold">House</th>
                  <th className="text-left py-2 font-semibold">Gochara</th>
                </tr>
              </thead>
              <tbody>
                {d.transitTable.map((t) => (
                  <tr key={t.body} className="border-b border-white/5">
                    <td className="py-1.5 pr-3 text-white whitespace-nowrap">
                      {t.body}{t.retrograde && <span className="text-red-400 ml-1" title="Retrograde">℞</span>}
                    </td>
                    <td className="py-1.5 pr-3 text-[var(--text-secondary)]">{t.signEnglish}</td>
                    <td className="py-1.5 pr-3 text-[var(--text-secondary)]">{t.house}</td>
                    <td className={`py-1.5 ${t.favourable ? "text-mystic-green" : "text-[var(--text-muted)]"}`}>
                      {t.favourable ? "Favourable" : "Testing"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {d.sadeSati && (
            <div className="mt-4 p-3 rounded-lg bg-red-400/5 border border-red-400/20">
              <div className="text-xs font-semibold text-red-400 mb-1">Sade Sati — {d.sadeSati.phase}</div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{d.sadeSati.note}</p>
            </div>
          )}
          {!d.sadeSati && d.shani && (
            <div className="mt-4 p-3 rounded-lg bg-gold-400/5 border border-gold-400/20">
              <div className="text-xs font-semibold text-gold-200 mb-1">{d.shani.label}</div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{d.shani.note}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center mb-4">
        <ShareButtons
          title={`${sign.charAt(0).toUpperCase() + sign.slice(1)} Horoscope Today`}
          text={`Check your ${sign} horoscope for today on VivaAI Astrology`}
          url={`https://vivaai.in/horoscope/${sign}`}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/horoscope" className="text-sm text-gold-400 hover:underline">← All Signs</Link>
        <Link href="/kundali" className="gold-btn text-sm px-6 py-2">Get Full Kundali</Link>
        <Link href={`/compatibility/${sign}`} className="glass-card text-sm px-6 py-2 text-gold-200 hover:text-gold-400 transition">{cap} Compatibility</Link>
      </div>

      {/* Internal links to other signs — crawl depth + engagement */}
      <div className="mt-10 border-t border-[var(--border)] pt-6">
        <h2 className="text-sm font-semibold text-gold-200 mb-3">Today&apos;s Horoscope for Other Signs</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {Object.keys(SYMBOLS).filter((s) => s !== sign).map((s) => (
            <Link key={s} href={`/horoscope/${s}`}
              className="text-xs text-center py-2 px-2 bg-white/[0.02] rounded-lg text-[var(--text-secondary)] hover:text-gold-400 hover:bg-white/[0.04] transition capitalize">
              {SYMBOLS[s]} {s}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[rgba(8,6,14,0.5)] border border-[var(--border)] rounded-lg p-3 text-center">
      <div className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider">{label}</div>
      <div className="text-sm font-semibold text-white mt-1">{value}</div>
    </div>
  );
}

function CategoryCard({ emoji, title, text, score }: { emoji: string; title: string; text: string; score: number }) {
  return (
    <div className="bg-white/[0.03] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gold-200">{emoji} {title}</h3>
        <span className="text-xs text-gold-400 font-semibold">{score}%</span>
      </div>
      <p className="text-xs text-[var(--text-muted)] leading-relaxed">{text}</p>
    </div>
  );
}
