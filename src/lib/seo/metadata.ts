import type { Metadata } from "next";

const SITE = "https://vivaai.in";
const NAME = "VivaAI Astrology";
const DEFAULT_DESC = "Free AI-powered Vedic Kundali, daily horoscope, compatibility matching & personalized astrology insights. Accurate birth charts with Lagna, Nakshatra, Dasha & remedies. Trusted by thousands across India for precise Vedic astrology calculations.";

const DEFAULT_KEYWORDS = [
  "free kundali", "vedic astrology", "birth chart", "AI astrology",
  "horoscope today", "kundali matching", "nakshatra compatibility",
  "zodiac compatibility", "panchang", "mangal dosha", "numerology",
  "astrology calculator", "vedic horoscope", "lagna chart",
  "daily horoscope", "marriage compatibility", "kundali online free",
  "janam kundali", "vivaai astrology",
];

export function seoMeta(opts: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  // Keep title under 60 chars by using short suffix
  const title = opts.title ? `${opts.title} — VivaAI` : `${NAME} — Free Vedic Kundali & AI Astrology`;
  // Keep description between 160-300 chars
  const description = opts.description || DEFAULT_DESC;
  const url = `${SITE}${opts.path || ""}`;
  // Merge page-specific keywords with defaults for comprehensive coverage
  const keywords = opts.keywords
    ? [...new Set([...opts.keywords, ...DEFAULT_KEYWORDS])]
    : DEFAULT_KEYWORDS;

  return {
    title,
    description,
    metadataBase: new URL(SITE),
    alternates: { canonical: url },
    keywords,
    authors: [{ name: NAME, url: SITE }],
    creator: NAME,
    publisher: NAME,
    category: "Astrology",
    openGraph: {
      title,
      description,
      url,
      siteName: NAME,
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@vivaai_in",
    },
    robots: { index: true, follow: true },
  };
}
