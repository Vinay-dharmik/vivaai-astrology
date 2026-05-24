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

const SIGN_DETAILS: Record<string, string> = {
  aries: "As an Aries, your ruling planet Mars energizes your drive and ambition. Today's planetary alignment activates your house of career and public image, bringing opportunities for leadership. Your natural courage serves you well in bold decisions. Trust your instincts but channel impulsive energy into constructive action. This is an excellent period for initiating new ventures and establishing your authority.",
  taurus: "Venus, your ruling planet, brings harmony to your material and emotional world today. Stability is your superpower — use it to build lasting foundations. Financial matters look favorable for long-term investments. Your patience and determination attract reliable opportunities. Creative pursuits and aesthetic projects receive cosmic support, making this ideal for beautifying your surroundings.",
  gemini: "Mercury sharpens your already brilliant communication skills today. Your adaptability allows you to navigate complex situations with ease. Intellectual pursuits and networking bring unexpected rewards. Stay curious but avoid spreading yourself too thin across too many projects. This is a powerful time for writing, teaching, learning, and connecting with like-minded people.",
  cancer: "The Moon illuminates your emotional intelligence today. Your nurturing nature creates safe spaces for meaningful connections. Home and family matters benefit from your attention. Trust your powerful intuition — it rarely leads you astray. Domestic improvements and family gatherings are especially blessed. Real estate matters may also see positive movement.",
  leo: "The Sun amplifies your natural charisma and creative energy today. You shine brightest when you lead with authenticity and generosity. Creative projects receive cosmic support. Your warm presence inspires confidence in those around you. Public speaking, performances, and self-expression are especially favored. Children and romantic interests bring joy.",
  virgo: "Mercury enhances your analytical precision and practical wisdom today. Your attention to detail uncovers solutions others miss. Health and wellness routines bring tangible improvements. Service to others creates fulfilling karma cycles. Organization and planning are your superpowers today. Technical skills and problem-solving abilities are at their peak.",
  libra: "Venus graces your relationships with beauty and understanding today. Your diplomatic skills resolve tensions and build bridges. Artistic pursuits flow naturally. Balance between giving and receiving creates sustainable happiness. Legal matters and partnerships receive positive cosmic energy. Aesthetic choices and design decisions are especially inspired.",
  scorpio: "Mars and Pluto deepen your transformative power today. Your investigative nature uncovers valuable hidden truths. Emotional depth creates profound connections. Financial matters tied to shared resources show promising developments. Research, psychology, and deep analysis yield breakthrough insights. Let go of what no longer serves your growth.",
  sagittarius: "Jupiter expands your horizons with wisdom and adventure today. Your optimistic spirit attracts positive experiences and people. Learning and philosophical exploration bring joy. Travel plans or educational goals receive cosmic blessings. International connections and cultural experiences are especially meaningful. Teaching and sharing knowledge multiplies your fortune.",
  capricorn: "Saturn rewards your disciplined approach with tangible recognition today. Your ambition and work ethic create lasting achievements. Authority figures notice your dedication. Long-term career goals take significant steps forward. Structural planning and strategic decisions are especially well-supported. Your reputation in professional circles grows stronger.",
  aquarius: "Saturn and Uranus combine innovation with practicality today. Your unique perspective creates breakthrough solutions for collective challenges. Networking brings unexpected but valuable connections. Humanitarian instincts guide meaningful choices. Technology projects and group collaborations are especially favored. Your vision for the future becomes clearer.",
  pisces: "Jupiter and Neptune amplify your compassion and spiritual awareness today. Creative and artistic expressions flow effortlessly. Your intuitive gifts are especially strong — trust the subtle guidance you receive. Meditation and reflection bring profound insights. Music, art, and spiritual practices are deeply fulfilling. Healing work benefits from cosmic support.",
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

export default async function ZodiacHoroscopePage({ params }: PageProps) {
  const { sign } = await params;
  const info = ZODIAC_INFO[sign];
  if (!info) notFound();

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const d = generateDailyHoroscope(sign, today);
  const detail = SIGN_DETAILS[sign] || "";

  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: "Horoscope", href: "/horoscope" }, { label: sign.charAt(0).toUpperCase() + sign.slice(1) }]} />
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">{SYMBOLS[sign]}</div>
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text capitalize mb-2">
          {sign} Horoscope Today
        </h1>
        <p className="text-sm text-[var(--text-muted)]">{dateStr} • {info.dates}</p>
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
          <p className="text-[var(--text-secondary)] leading-relaxed">{detail}</p>
        </div>

        {/* Category predictions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <CategoryCard emoji="💼" title="Career" text={d.career} score={d.careerScore} />
          <CategoryCard emoji="❤️" title="Love & Relationships" text={d.love} score={d.loveScore} />
          <CategoryCard emoji="🏥" title="Health & Wellness" text={d.health} score={d.healthScore} />
          <CategoryCard emoji="💰" title="Finance" text={d.finance} score={d.financeScore} />
        </div>

        {/* Intensity bar */}
        <div className="pt-4 border-t border-[var(--border)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2">
            <span>Overall Cosmic Intensity</span>
            <span className="text-gold-400 font-semibold">{d.intensity}%</span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full" style={{ width: `${d.intensity}%` }} />
          </div>
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
        <Link href="/matching" className="glass-card text-sm px-6 py-2 text-gold-200 hover:text-gold-400 transition">Check Compatibility</Link>
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
