import Link from "next/link";
import { Sparkles } from "lucide-react";

const TOOLS = [
  { href: "/kundali", label: "Free Kundali" },
  { href: "/matching", label: "Kundali Matching" },
  { href: "/horoscope", label: "Daily Horoscope" },
  { href: "/panchang", label: "Panchang" },
  { href: "/remedies", label: "Astrology Remedies" },
  { href: "/compatibility", label: "Zodiac Compatibility" },
  { href: "/nakshatra", label: "27 Nakshatras" },
  { href: "/nakshatra-compatibility", label: "Nakshatra Matching" },
  { href: "/calculator/numerology", label: "Numerology" },
  { href: "/calculator/age", label: "Age Calculator" },
];

const SIGNS_COL1 = [
  { href: "/horoscope/aries", label: "Aries" },
  { href: "/horoscope/taurus", label: "Taurus" },
  { href: "/horoscope/gemini", label: "Gemini" },
  { href: "/horoscope/cancer", label: "Cancer" },
  { href: "/horoscope/leo", label: "Leo" },
  { href: "/horoscope/virgo", label: "Virgo" },
];

const SIGNS_COL2 = [
  { href: "/horoscope/libra", label: "Libra" },
  { href: "/horoscope/scorpio", label: "Scorpio" },
  { href: "/horoscope/sagittarius", label: "Sagittarius" },
  { href: "/horoscope/capricorn", label: "Capricorn" },
  { href: "/horoscope/aquarius", label: "Aquarius" },
  { href: "/horoscope/pisces", label: "Pisces" },
];

const LEGAL = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/refund-policy", label: "Refund Policy" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--border)] mt-20">
      <div className="section-container py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <span className="font-sora font-bold gold-text">VivaAI</span>
            </Link>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              AI-powered Vedic astrology platform. Get accurate Kundali, horoscopes, compatibility analysis and personalized remedies.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-xs font-semibold text-gold-200 uppercase tracking-wider mb-3">Tools</h4>
            <ul className="space-y-1.5">
              {TOOLS.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-xs text-[var(--text-muted)] hover:text-gold-400 transition">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Signs 1 */}
          <div>
            <h4 className="text-xs font-semibold text-gold-200 uppercase tracking-wider mb-3">Horoscopes</h4>
            <ul className="space-y-1.5">
              {SIGNS_COL1.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-xs text-[var(--text-muted)] hover:text-gold-400 transition">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Signs 2 */}
          <div>
            <div className="text-xs font-semibold text-gold-200 uppercase tracking-wider mb-3 invisible" aria-hidden="true">Signs</div>
            <ul className="space-y-1.5">
              {SIGNS_COL2.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-xs text-[var(--text-muted)] hover:text-gold-400 transition">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-gold-200 uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-1.5">
              {LEGAL.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-xs text-[var(--text-muted)] hover:text-gold-400 transition">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-6 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} VivaAI Astrology (vivaai.in). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
