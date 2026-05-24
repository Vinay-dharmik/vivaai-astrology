import { notFound } from "next/navigation";
import Link from "next/link";
import { seoMeta } from "@/lib/seo/metadata";
import { NAKSHATRAS, NAK_LORDS } from "@/lib/astrology/constants";

const NAK_DEITIES = ["Ashwini Kumaras","Yama","Agni","Brahma","Soma","Rudra","Aditi","Brihaspati","Nagas","Pitrs","Bhaga","Aryaman","Savitar","Tvashtar","Vayu","Indragni","Mitra","Indra","Nirriti","Apas","Vishvedeva","Vishnu","Vasu","Varuna","Ajaikapada","Ahirbudhnya","Pushan"];
const NAK_SYMBOLS = ["Horse head","Yoni/Elephant","Razor/Flame","Chariot/Cart","Deer head","Teardrop/Diamond","Bow & Quiver","Flower/Circle","Coiled serpent","Palanquin","Front legs of bed","Back legs of bed","Hand/Fist","Bright jewel/Pearl","Coral/Sapphire","Triumphal arch","Lotus flower","Earring/Umbrella","Elephant tusk/Lion's tail","Elephant tusk/Fan","Drum/Bed","Ear/Trident","Drum","Empty circle/1000 flowers","Sword/Two-faced man","Twin serpent","Fish/Drum"];
const NAK_GANAS = ["Deva","Manushya","Rakshasa","Deva","Deva","Manushya","Deva","Deva","Rakshasa","Rakshasa","Manushya","Deva","Deva","Rakshasa","Deva","Rakshasa","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva","Rakshasa","Rakshasa","Manushya","Deva","Deva"];
const NAK_ANIMALS = ["Horse","Elephant","Sheep","Serpent","Serpent","Dog","Cat","Ram","Cat","Rat","Rat","Cow","Buffalo","Tiger","Buffalo","Tiger","Deer","Deer","Dog","Monkey","Mongoose","Monkey","Lion","Horse","Lion","Cow","Elephant"];

const NAK_DESCRIPTIONS: Record<string, { personality: string; career: string; relationship: string; health: string; strengths: string[]; weaknesses: string[] }> = {
  "Ashwini": {
    personality: "Ashwini natives are energetic, quick-witted, and pioneering. Ruled by the Ashwini Kumaras (divine physicians), they possess natural healing abilities and a strong desire to help others. They are action-oriented, independent, and often ahead of their time.",
    career: "Medicine, healthcare, racing, sports, emergency services, transportation, horse breeding, veterinary science, and any field requiring speed and decisiveness. They excel as entrepreneurs and innovators.",
    relationship: "In relationships, Ashwini natives are passionate and impulsive. They value freedom and may resist being controlled. Best matched with partners who appreciate their adventurous spirit and give them space to grow.",
    health: "Generally robust health with strong recuperative powers. May experience head-related issues, migraines, or injuries from speed-related activities. Regular exercise and competitive sports benefit them greatly.",
    strengths: ["Quick learner", "Natural healer", "Courageous", "Independent", "Pioneering spirit"],
    weaknesses: ["Impulsive", "Restless", "Can be stubborn", "May start things without finishing"],
  },
};

// Generate default descriptions for nakshatras without specific data
function getDefaultDesc(name: string, lord: string, deity: string, gana: string) {
  const lordTraits: Record<string, string> = {
    Sun: "leadership, authority, and confidence", Moon: "intuition, empathy, and nurturing", Mars: "courage, energy, and determination",
    Mercury: "intelligence, communication, and adaptability", Jupiter: "wisdom, spirituality, and prosperity",
    Venus: "beauty, creativity, and relationships", Saturn: "discipline, patience, and perseverance",
    Rahu: "ambition, innovation, and unconventional thinking", Ketu: "spirituality, detachment, and insight",
  };
  const ganaTraits: Record<string, string> = {
    Deva: "divine, refined, and virtuous", Manushya: "balanced, practical, and human-oriented", Rakshasa: "intense, powerful, and fearless",
  };
  const traits = lordTraits[lord] || "unique qualities";
  const gTrait = ganaTraits[gana] || "balanced";

  return {
    personality: `${name} Nakshatra natives are blessed with ${traits}. As a ${gana} gana nakshatra ruled by ${lord} and presided by deity ${deity}, they possess a ${gTrait} temperament. They are naturally drawn to knowledge and self-improvement, with an innate ability to transform challenges into opportunities for growth.`,
    career: `Careers aligned with ${lord}'s energy are most favorable. Fields requiring ${traits} bring the greatest success. Government roles, education, research, business, and creative arts are all potential avenues depending on the overall birth chart configuration.`,
    relationship: `In relationships, ${name} natives seek partners who complement their ${gTrait} nature. They value loyalty, intellectual connection, and mutual respect. The influence of ${lord} shapes their romantic preferences and communication style in intimate partnerships.`,
    health: `Health is generally good when lifestyle is balanced. ${lord}'s influence suggests attention to specific body areas. Regular spiritual practice and alignment with natural rhythms enhance overall vitality and longevity.`,
    strengths: [`${lord}-influenced wisdom`, "Strong determination", "Natural intelligence", "Spiritual depth"],
    weaknesses: ["Can be overly serious", "May resist change", "Needs to balance work and rest"],
  };
}

const slugToName = (slug: string) => NAKSHATRAS.find((n) => n.toLowerCase().replace(/\s+/g, "-") === slug) || "";

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const name = slugToName(slug);
  if (!name) return {};
  const idx = NAKSHATRAS.indexOf(name);
  return seoMeta({
    title: `${name} Nakshatra — Personality, Career & Compatibility`,
    description: `Complete guide to ${name} Nakshatra (#${idx + 1}). Deity: ${NAK_DEITIES[idx]}. Lord: ${NAK_LORDS[idx]}. Personality traits, career guidance, relationships & remedies.`,
    path: `/nakshatra/${slug}`,
  });
}

export function generateStaticParams() {
  return NAKSHATRAS.map((n) => ({ slug: n.toLowerCase().replace(/\s+/g, "-") }));
}

export default async function NakshatraDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const name = slugToName(slug);
  if (!name) notFound();

  const idx = NAKSHATRAS.indexOf(name);
  const lord = NAK_LORDS[idx];
  const deity = NAK_DEITIES[idx];
  const symbol = NAK_SYMBOLS[idx];
  const gana = NAK_GANAS[idx];
  const animal = NAK_ANIMALS[idx];
  const rashi = ["Aries","Aries","Aries/Taurus","Taurus","Taurus/Gemini","Gemini","Gemini/Cancer","Cancer","Cancer","Leo","Leo","Leo/Virgo","Virgo","Virgo/Libra","Libra","Libra/Scorpio","Scorpio","Scorpio","Sagittarius","Sagittarius","Sagittarius/Capricorn","Capricorn","Capricorn/Aquarius","Aquarius","Aquarius/Pisces","Pisces","Pisces"][idx] || "";
  const desc = NAK_DESCRIPTIONS[name] || getDefaultDesc(name, lord, deity, gana);

  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">⭐</div>
        <p className="text-xs text-gold-200 uppercase tracking-[0.2em] mb-1">Nakshatra #{idx + 1}</p>
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-2">{name} Nakshatra</h1>
        <p className="text-sm text-[var(--text-muted)]">{rashi} • Lord: {lord} • Deity: {deity}</p>
      </div>

      <div className="glass-card-bright p-6 sm:p-8 space-y-6">
        {/* Quick facts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <Fact label="Ruling Planet" value={lord} />
          <Fact label="Deity" value={deity} />
          <Fact label="Symbol" value={symbol} />
          <Fact label="Gana" value={gana} />
          <Fact label="Animal" value={animal} />
          <Fact label="Rashi" value={rashi} />
          <Fact label="Padas" value="1, 2, 3, 4" />
          <Fact label="Degree" value={`${((idx * 13.333)).toFixed(1)}° – ${((idx + 1) * 13.333).toFixed(1)}°`} />
        </div>

        <Sec title="🧠 Personality & Nature">{desc.personality}</Sec>
        <Sec title="💼 Career & Profession">{desc.career}</Sec>
        <Sec title="❤️ Relationships & Marriage">{desc.relationship}</Sec>
        <Sec title="🏥 Health">{desc.health}</Sec>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-2">✦ Strengths</h3>
            <ul className="space-y-1">{desc.strengths.map((s) => <li key={s} className="text-sm text-[var(--text-secondary)] flex gap-2"><span className="text-mystic-green">✓</span>{s}</li>)}</ul>
          </div>
          <div>
            <h3 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-2">⚠ Challenges</h3>
            <ul className="space-y-1">{desc.weaknesses.map((w) => <li key={w} className="text-sm text-[var(--text-secondary)] flex gap-2"><span className="text-red-400">•</span>{w}</li>)}</ul>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-6">
        <Link href="/nakshatra" className="text-sm text-gold-400 hover:underline">← All Nakshatras</Link>
        <Link href="/kundali" className="gold-btn text-sm px-6 py-2">Find Your Nakshatra</Link>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[rgba(8,6,14,0.5)] border border-[var(--border)] rounded-lg p-2.5 text-center">
      <div className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider">{label}</div>
      <div className="text-xs font-semibold text-white mt-1">{value}</div>
    </div>
  );
}

function Sec({ title, children }: { title: string; children: string }) {
  return (
    <div>
      <h2 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-2">{title}</h2>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{children}</p>
    </div>
  );
}
