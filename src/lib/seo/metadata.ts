import type { Metadata } from "next";

const SITE = "https://vivaai.in";
const NAME = "VivaAI Astrology";
const DEFAULT_DESC = "Free Vedic Kundali, daily horoscope, Ashtakoot matching and chart-specific remedies. Birth charts with Lagna, Nakshatra and Vimshottari Dasha, computed from published astronomical algorithms using the Lahiri Ayanamsa.";

const DEFAULT_KEYWORDS = [
  "free kundali", "vedic astrology", "birth chart", "janam kundali",
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
  /**
   * Set on pages that are calculator output rather than editorial content —
   * they are template-driven, so indexing hundreds of them reads as thin /
   * scaled content to search engines. They stay crawlable (follow) so the
   * internal links still pass, but they are kept out of the index.
   */
  noindex?: boolean;
}): Metadata {
  // Keep title under 60 chars by using short suffix
  const title = opts.title ? `${opts.title} — VivaAI` : `${NAME} — Free Vedic Kundali & Birth Chart`;
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
    robots: opts.noindex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true },
  };
}
