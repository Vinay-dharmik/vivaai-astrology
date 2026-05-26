import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { NAKSHATRAS } from "@/lib/astrology/constants";
import { slugify } from "@/lib/astrology/nakshatraCompat";
import { BODY_ORDER } from "@/lib/astrology/constants";

const BASE = "https://vivaai.in";
const SIGNS = ["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"];
const HOUSE_SUFFIX = (h: number) => h === 1 ? "1st" : h === 2 ? "2nd" : h === 3 ? "3rd" : `${h}th`;

/**
 * Comprehensive sitemap including ALL programmatic pages.
 * Google sitemaps support up to 50,000 URLs — we use ~1000+.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // ── Core pages (highest priority) ─────────────────
  const core: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/kundali`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE}/matching`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/horoscope`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/panchang`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${BASE}/compatibility`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/nakshatra`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/nakshatra-compatibility`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/remedies`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/calculator/numerology`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/calculator/age`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/calculator/lucky-number`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/calculator/lucky-color`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/calculator/mangal-dosha`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/calculator/marriage-age`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/refund-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // ── Horoscope sign pages (12) ─────────────────
  const horoscopes: MetadataRoute.Sitemap = SIGNS.map(sign => ({
    url: `${BASE}/horoscope/${sign}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // ── Compatibility pages (12) ──────────────────
  const compatibility: MetadataRoute.Sitemap = SIGNS.map(sign => ({
    url: `${BASE}/compatibility/${sign}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // ── Nakshatra detail pages (27) ───────────────
  const nakshatraPages: MetadataRoute.Sitemap = NAKSHATRAS.map(nak => ({
    url: `${BASE}/nakshatra/${slugify(nak)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  // ── Blog posts (all) ──────────────────────────
  const blogs: MetadataRoute.Sitemap = BLOG_POSTS.map(post => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // ── ALL 729 Nakshatra Compatibility pages ─────
  const nakCompat: MetadataRoute.Sitemap = [];
  for (let i = 0; i < 27; i++) {
    for (let j = 0; j < 27; j++) {
      nakCompat.push({
        url: `${BASE}/nakshatra-compatibility/${slugify(NAKSHATRAS[i])}-and-${slugify(NAKSHATRAS[j])}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.55,
      });
    }
  }

  // ── ALL 108 Planet-in-House pages ─────────────
  const planetHouse: MetadataRoute.Sitemap = BODY_ORDER.flatMap(planet =>
    Array.from({ length: 12 }, (_, h) => ({
      url: `${BASE}/astrology/${planet.toLowerCase()}-in-${HOUSE_SUFFIX(h + 1)}-house`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.55,
    }))
  );

  return [
    ...core,
    ...horoscopes,
    ...compatibility,
    ...nakshatraPages,
    ...blogs,
    ...nakCompat,
    ...planetHouse,
  ];
}
