import { seoMeta } from "@/lib/seo/metadata";

export const metadata = seoMeta({ title: "Terms & Conditions", path: "/terms",
  description: "Terms and conditions for using VivaAI Astrology platform. Covers service usage, payment terms, intellectual property, and user responsibilities for our Vedic astrology tools." });

export default function TermsPage() {
  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <h1 className="font-sora font-bold text-3xl gold-text mb-6">Terms & Conditions</h1>
      <div className="glass-card p-6 sm:p-8 space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm">
        <p><em>Effective: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</em></p>
        <p>By using VivaAI Astrology (vivaai.in), you agree to these terms.</p>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">Service Description</h2>
        <p>VivaAI provides AI-powered Vedic astrology tools including Kundali generation, horoscopes, compatibility matching, and personalized astrological insights.</p>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">Disclaimer</h2>
        <p>Astrology predictions are for entertainment and guidance purposes only. They should not be considered as professional advice for legal, medical, or financial decisions.</p>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">User Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">Payments & Subscriptions</h2>
        <p>Premium subscriptions are processed through Razorpay. Prices are in INR. Subscriptions auto-renew unless cancelled before the billing date.</p>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">Intellectual Property</h2>
        <p>All content, designs, and algorithms on vivaai.in are owned by VivaAI. Unauthorized reproduction is prohibited.</p>
      </div>
    </div>
  );
}
