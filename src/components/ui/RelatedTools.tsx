import Link from "next/link";

/**
 * Internal linking component for SEO — shows related pages at the bottom of content pages.
 * This creates a dense internal link network which improves:
 * 1. Crawlability (Googlebot discovers more pages)
 * 2. Page authority distribution (link equity flows between pages)
 * 3. User engagement (lower bounce rate, more page views = more AdSense revenue)
 */

interface RelatedLink {
  href: string;
  title: string;
  desc: string;
}

const ALL_TOOLS: RelatedLink[] = [
  { href: "/kundali", title: "Free Kundali", desc: "Complete Vedic birth chart with all 9 planets" },
  { href: "/horoscope", title: "Daily Horoscope", desc: "Today's horoscope for all 12 zodiac signs" },
  { href: "/matching", title: "Kundali Matching", desc: "36-point Ashtakoot compatibility analysis" },
  { href: "/nakshatra-compatibility", title: "Nakshatra Matching", desc: "27 Nakshatra compatibility checker" },
  { href: "/calculator/numerology", title: "Numerology", desc: "Life path, destiny & soul number calculator" },
  { href: "/calculator/panchang", title: "Panchang", desc: "Today's Tithi, Nakshatra, Yoga & Karana" },
  { href: "/calculator/lucky-number", title: "Lucky Number", desc: "Find your lucky number by name & DOB" },
  { href: "/calculator/lucky-color", title: "Lucky Color", desc: "Discover your auspicious colors" },
  { href: "/calculator/mangal-dosha", title: "Mangal Dosha", desc: "Check Mars placement & remedies" },
  { href: "/calculator/marriage-age", title: "Marriage Age", desc: "Predicted marriage timing window" },
  { href: "/zodiac", title: "Zodiac Signs", desc: "Explore all 12 zodiac sign profiles" },
  { href: "/blog", title: "Astrology Blog", desc: "Expert articles on Vedic astrology" },
];

export function RelatedTools({ currentPath }: { currentPath: string }) {
  // Show 6 related links, excluding the current page
  const links = ALL_TOOLS.filter((l) => l.href !== currentPath).slice(0, 6);

  return (
    <section className="mt-12 border-t border-[var(--border)] pt-8">
      <h2 className="font-sora font-bold text-lg text-white mb-4">
        Explore More Free Tools
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="glass-card p-4 rounded-xl hover:border-gold-400/40 transition-all group"
          >
            <h3 className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors">
              {link.title}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
