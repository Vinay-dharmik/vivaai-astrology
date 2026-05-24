import { seoMeta } from "@/lib/seo/metadata";

export const metadata = seoMeta({ title: "About Us", path: "/about",
  description: "Learn about VivaAI Astrology - India's AI-powered Vedic astrology platform for free Kundali, horoscopes & personalized predictions." });

export default function AboutPage() {
  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <h1 className="font-sora font-bold text-3xl gold-text mb-6">About VivaAI Astrology</h1>
      <div className="glass-card p-6 sm:p-8 space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm">
        <p>
          <strong className="text-white">VivaAI Astrology</strong> is India&apos;s modern AI-powered Vedic astrology platform.
          We combine ancient Vedic wisdom with cutting-edge technology to deliver accurate birth charts,
          daily horoscopes, and personalized astrological insights.
        </p>
        <p>
          Our platform uses the <strong className="text-gold-200">Lahiri Ayanamsa</strong> and precise astronomical
          calculations to generate Kundali reports that include Lagna, Moon sign, Nakshatra, planetary positions,
          Vimshottari Dasha timeline, and much more.
        </p>
        <p>
          Founded with the mission to make authentic Vedic astrology accessible to everyone, VivaAI serves
          thousands of users across India with free and premium astrology tools.
        </p>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">Our Mission</h2>
        <p>
          To democratize access to accurate Vedic astrology through technology, providing personalized
          cosmic guidance to help people make informed life decisions.
        </p>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">Contact</h2>
        <p>Website: <a href="https://vivaai.in" className="text-gold-400 hover:underline">vivaai.in</a></p>
      </div>
    </div>
  );
}
