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
  // `now` is for genuinely daily-changing pages (home, horoscope, panchang).
  // `built` is a stable date for static content — so Google doesn't learn that
  // every lastmod is meaningless (which makes it ignore all our dates).
  const now = new Date().toISOString();
  const built = "2026-05-01T00:00:00.000Z";

  // ── Core pages (highest priority) ─────────────────
  const core: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/kundali`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE}/matching`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/horoscope`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/panchang`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${BASE}/compatibility`, lastModified: built, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/nakshatra`, lastModified: built, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/nakshatra-compatibility`, lastModified: built, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/remedies`, lastModified: built, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/calculator`, lastModified: built, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/calculator/numerology`, lastModified: built, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/calculator/age`, lastModified: built, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/calculator/lucky-number`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/calculator/lucky-color`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/calculator/mangal-dosha`, lastModified: built, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/calculator/marriage-age`, lastModified: built, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/about`, lastModified: built, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/contact`, lastModified: built, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/privacy`, lastModified: built, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: built, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/disclaimer`, lastModified: built, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/refund-policy`, lastModified: built, changeFrequency: "yearly", priority: 0.3 },
  ];

  // ── Horoscope sign pages (12) — genuinely daily ─────────────────
  const horoscopes: MetadataRoute.Sitemap = SIGNS.map(sign => ({
    url: `${BASE}/horoscope/${sign}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // ── Compatibility pages (12) ──────────────────
  const compatibility: MetadataRoute.Sitemap = SIGNS.map(sign => ({
    url: `${BASE}/compatibility/${sign}`,
    lastModified: built,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // ── Nakshatra detail pages (27) ───────────────
  const nakshatraPages: MetadataRoute.Sitemap = NAKSHATRAS.map(nak => ({
    url: `${BASE}/nakshatra/${slugify(nak)}`,
    lastModified: built,
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
        lastModified: built,
        changeFrequency: "monthly",
        priority: 0.55,
      });
    }
  }

  // ── ALL 108 Planet-in-House pages ─────────────
  const planetHouse: MetadataRoute.Sitemap = BODY_ORDER.flatMap(planet =>
    Array.from({ length: 12 }, (_, h) => ({
      url: `${BASE}/astrology/${planet.toLowerCase()}-in-${HOUSE_SUFFIX(h + 1)}-house`,
      lastModified: built,
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
