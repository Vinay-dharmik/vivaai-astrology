import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { NAKSHATRAS } from "@/lib/astrology/constants";
import { slugify } from "@/lib/astrology/nakshatraCompat";
import { BODY_ORDER } from "@/lib/astrology/constants";

const BASE = "https://vivaai.in";
const SIGNS = ["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Core pages
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
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/refund-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Horoscope sign pages (12)
  const horoscopes: MetadataRoute.Sitemap = SIGNS.map(sign => ({
    url: `${BASE}/horoscope/${sign}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // Blog posts
  const blogs: MetadataRoute.Sitemap = BLOG_POSTS.map(post => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Nakshatra compatibility matrix (729 — top 50 for sitemap, rest discovered via internal links)
  const nakCompatSample: MetadataRoute.Sitemap = [];
  for (let i = 0; i < 27; i++) {
    // Include each nakshatra paired with next 2 for sitemap crawl seeding
    for (let j = 0; j < Math.min(2, 27); j++) {
      const n2Idx = (i + j) % 27;
      nakCompatSample.push({
        url: `${BASE}/nakshatra-compatibility/${slugify(NAKSHATRAS[i])}-and-${slugify(NAKSHATRAS[n2Idx])}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Planet-in-house pages (108 — sample top ones for sitemap)
  const planetHouseSample: MetadataRoute.Sitemap = BODY_ORDER.slice(0, 5).flatMap(planet =>
    [1,7,10].map(h => ({
      url: `${BASE}/astrology/${planet.toLowerCase()}-in-${h}${h===1?"st":h===2?"nd":h===3?"rd":"th"}-house`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.55,
    }))
  );

  return [...core, ...horoscopes, ...blogs, ...nakCompatSample, ...planetHouseSample];
}
