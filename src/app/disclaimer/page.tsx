import { seoMeta } from "@/lib/seo/metadata";

export const metadata = seoMeta({ title: "Disclaimer", path: "/disclaimer",
  description: "VivaAI Astrology disclaimer. Our Vedic astrology predictions are for entertainment and guidance purposes only. Consult qualified professionals for important life decisions." });

export default function DisclaimerPage() {
  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <h1 className="font-sora font-bold text-3xl gold-text mb-6">Disclaimer</h1>
      <div className="glass-card p-6 sm:p-8 space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm">
        <p>The astrological information provided on VivaAI Astrology (vivaai.in) is for <strong className="text-gold-200">entertainment and informational purposes only</strong>.</p>
        <p>While we use accurate astronomical calculations (Lahiri Ayanamsa, verified ephemeris data) to generate birth charts and planetary positions, the interpretations and predictions are based on traditional Vedic astrology principles and AI analysis.</p>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">Important Notes</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Astrological predictions should <strong>not</strong> be used as the sole basis for important life decisions.</li>
          <li>For medical, legal, or financial matters, always consult qualified professionals.</li>
          <li>Results may vary and are not guaranteed.</li>
          <li>Birth chart accuracy depends on the precision of birth time and place provided.</li>
        </ul>
        <p>By using our services, you acknowledge that VivaAI Astrology is not responsible for any decisions made based on astrological content.</p>
      </div>
    </div>
  );
}
