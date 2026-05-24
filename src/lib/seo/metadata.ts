import type { Metadata } from "next";

const SITE = "https://vivaai.in";
const NAME = "VivaAI Astrology";
const DEFAULT_DESC = "Free AI-powered Vedic Kundali, daily horoscope, compatibility matching & personalized astrology insights. Accurate birth charts with Lagna, Nakshatra, Dasha & remedies. Trusted by thousands across India for precise Vedic astrology calculations.";

export function seoMeta(opts: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  // Keep title under 60 chars by using short suffix
  const title = opts.title ? `${opts.title} — VivaAI` : `${NAME} — Free Vedic Kundali & AI Astrology`;
  // Keep description between 160-300 chars
  const description = opts.description || DEFAULT_DESC;
  const url = `${SITE}${opts.path || ""}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE),
    alternates: { canonical: url },
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
    },
    robots: { index: true, follow: true },
  };
}
