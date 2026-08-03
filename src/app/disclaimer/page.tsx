import { seoMeta } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata = seoMeta({ title: "Disclaimer", path: "/disclaimer",
  description: "VivaAI Astrology disclaimer. Our Vedic astrology predictions are for entertainment and informational purposes only. Understand our limitations, accuracy statements, and user responsibilities." });

export default function DisclaimerPage() {
  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: "Disclaimer" }]} />
      <h1 className="font-sora font-bold text-3xl gold-text mb-6">Disclaimer</h1>
      <div className="glass-card p-6 sm:p-8 space-y-5 text-[var(--text-secondary)] leading-relaxed text-sm">
        <p><em>Last updated: June 1, 2026</em></p>

        <div className="bg-gold-400/5 border border-gold-400/20 rounded-lg p-4">
          <p className="text-white font-semibold mb-2">⚠️ Important Notice</p>
          <p>The astrological information, predictions, and recommendations provided on VivaAI Astrology (vivaai.in) are for <strong className="text-gold-200">entertainment and informational purposes only</strong>. They do not constitute professional advice of any kind and should not be used as the sole basis for any important life decisions.</p>
        </div>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">1. Entertainment Purpose</h2>
        <p>VivaAI Astrology provides Vedic astrology tools, birth chart calculations, horoscope predictions, compatibility analyses, and related content purely for <strong className="text-white">entertainment, educational, and informational purposes</strong>. While we strive for accuracy in our astronomical calculations, the astrological interpretations derived from these calculations are based on traditional beliefs and should be treated as one perspective among many.</p>
        <p>We encourage users to enjoy our content as a source of insight and reflection, not as definitive statements about their future or life circumstances.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">2. Accuracy of Astronomical Calculations</h2>
        <p>Planetary positions are computed from the periodic series in Jean Meeus&apos;s <em>Astronomical Algorithms</em> and converted to the sidereal zodiac using the <strong className="text-gold-200">Lahiri Ayanamsa</strong>. Verified against independently published equinox, solstice and eclipse timings, the engine places the Sun within about 0.4 arcminutes and the Moon within about 0.9 arcminutes; the five visible planets fall within a few arcminutes. We do not claim to match any particular commercial package — small differences between astrology programs are normal and usually come from ayanamsa or node conventions. In practice the accuracy of your chart is limited by the birth details you provide, not by the ephemeris:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-white">Birth Time:</strong> Even a difference of a few minutes can change the Ascendant (Lagna), which affects the entire chart structure. If your birth time is approximate, the Ascendant-related predictions may vary.</li>
          <li><strong className="text-white">Birth Place:</strong> The geographical coordinates of your birth place affect house calculations. We use geocoding services to convert location names to coordinates, which may have minor variations.</li>
          <li><strong className="text-white">Birth Date:</strong> If your birth occurred around midnight, timezone considerations become crucial. Ensure your birth date reflects the correct date for your birth timezone.</li>
        </ul>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">3. Limitations of Astrological Interpretations</h2>
        <p>While our calculation engine is precise, astrological interpretations are inherently subjective. Different schools of Vedic astrology may interpret the same planetary positions differently. Our interpretations follow mainstream <em>Parashara</em> tradition, but other valid traditions (Jaimini, Nadi, KP) may offer different perspectives on the same chart.</p>
        <p>Astrological predictions are probabilistic in nature and should be understood as tendencies and possibilities, not certainties. Many factors beyond astrology — including free will, environment, education, and personal choices — shape life outcomes.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">4. Not Professional Advice</h2>
        <p>The content on vivaai.in does <strong className="text-white">not</strong> constitute and should <strong className="text-white">not</strong> be used as a substitute for:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-white">Medical Advice:</strong> Health-related predictions in birth charts are based on traditional Vedic concepts, not medical science. Always consult qualified healthcare professionals for medical concerns.</li>
          <li><strong className="text-white">Legal Advice:</strong> Any legal-related predictions or suggestions are general in nature. Consult a qualified legal professional for specific legal matters.</li>
          <li><strong className="text-white">Financial Advice:</strong> Financial predictions and wealth-related analyses are based on traditional house significations, not financial expertise. Consult qualified financial advisors for investment decisions.</li>
          <li><strong className="text-white">Psychological or Relationship Counseling:</strong> Compatibility analyses and relationship predictions are based on astrological parameters, not professional counseling methodologies.</li>
        </ul>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">5. Gemstone and Remedy Disclaimer</h2>
        <p>Our remedy recommendations (gemstones, mantras, fasting, donations) are based on <strong className="text-gold-200">traditional Vedic astrology texts</strong>. These recommendations are cultural and spiritual in nature. We make no claims about the therapeutic, healing, or medical properties of gemstones or other remedial measures. Always consult a qualified Vedic astrologer before wearing powerful gemstones, especially Blue Sapphire (Neelam), which can have strong effects according to tradition.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">6. User Responsibility</h2>
        <p>By using VivaAI Astrology, you acknowledge and agree that:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>You use our services at your own risk and discretion.</li>
          <li>You are solely responsible for any decisions made based on astrological content.</li>
          <li>VivaAI Astrology is not liable for any consequences arising from the use of our predictions, recommendations, or analyses.</li>
          <li>You will seek professional advice for important life decisions rather than relying solely on astrological guidance.</li>
        </ul>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">7. Third-Party Content</h2>
        <p>Our website may contain links to external websites, articles, or resources. We are not responsible for the accuracy, content, or practices of third-party websites. Inclusion of a link does not imply endorsement of the linked site or its content.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">8. Contact</h2>
        <p>If you have any questions or concerns about this Disclaimer, please contact us at <a href="mailto:support@vivaai.in" className="text-gold-400 hover:underline">support@vivaai.in</a> or visit our <a href="/contact" className="text-gold-400 hover:underline">Contact page</a>.</p>
      </div>
    </div>
  );
}
