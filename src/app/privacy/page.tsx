import { seoMeta } from "@/lib/seo/metadata";

export const metadata = seoMeta({ title: "Privacy Policy", path: "/privacy",
  description: "VivaAI Astrology privacy policy. Learn how we collect, use, and protect your personal data." });

export default function PrivacyPage() {
  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <h1 className="font-sora font-bold text-3xl gold-text mb-6">Privacy Policy</h1>
      <div className="glass-card p-6 sm:p-8 space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm">
        <p><em>Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</em></p>
        <p>VivaAI Astrology (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website vivaai.in. This page informs you of our policies regarding the collection, use, and disclosure of personal data.</p>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">Information We Collect</h2>
        <p>We collect information you provide directly: name, date of birth, time of birth, place of birth, and email address. This data is used solely for generating astrological reports.</p>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">How We Use Your Information</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Generate personalized Kundali and astrological reports</li>
          <li>Provide daily horoscope predictions</li>
          <li>Improve our services and user experience</li>
          <li>Process payments for premium services</li>
        </ul>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">Data Security</h2>
        <p>We implement industry-standard security measures to protect your personal data. Birth details are encrypted and stored securely.</p>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">Cookies</h2>
        <p>We use cookies for analytics and improving user experience. Third-party services like Google Analytics and Google AdSense may also use cookies.</p>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">Third-Party Services</h2>
        <p>We may use third-party services including Google Analytics, Google AdSense, and Razorpay for payment processing. Each has their own privacy policies.</p>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">Contact</h2>
        <p>For privacy concerns, contact us at vivaai.in.</p>
      </div>
    </div>
  );
}
