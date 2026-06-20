import { seoMeta } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata = seoMeta({ title: "Terms & Conditions", path: "/terms",
  description: "Terms and conditions for using VivaAI Astrology platform. Covers service usage, payment terms, intellectual property, user responsibilities, disclaimers, and governing law for our Vedic astrology tools." });

export default function TermsPage() {
  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: "Terms & Conditions" }]} />
      <h1 className="font-sora font-bold text-3xl gold-text mb-6">Terms & Conditions</h1>
      <div className="glass-card p-6 sm:p-8 space-y-5 text-[var(--text-secondary)] leading-relaxed text-sm">
        <p><em>Effective: June 1, 2026</em></p>

        <p>Welcome to VivaAI Astrology. These Terms & Conditions (&quot;Terms&quot;) govern your use of the website <strong className="text-white">vivaai.in</strong> (the &quot;Service&quot;), operated by VivaAI Astrology (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing or using our Service, you agree to be bound by these Terms. If you do not agree, please do not use the Service.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">1. Acceptance of Terms</h2>
        <p>By accessing, browsing, or using any part of vivaai.in, you acknowledge that you have read, understood, and agree to be bound by these Terms, our <a href="/privacy" className="text-gold-400 hover:underline">Privacy Policy</a>, and our <a href="/disclaimer" className="text-gold-400 hover:underline">Disclaimer</a>. We reserve the right to modify these Terms at any time. Continued use after modifications constitutes acceptance of the updated Terms.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">2. Service Description</h2>
        <p>VivaAI Astrology provides AI-powered and rule-based Vedic astrology tools and content, including but not limited to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Kundali (birth chart) generation with planetary positions, Dasha, Dosha, and Yoga analysis</li>
          <li>Kundali matching (Ashtakoot Gun Milan) for marriage compatibility</li>
          <li>Daily, weekly, and monthly horoscope predictions for all zodiac signs</li>
          <li>Daily Panchang (Hindu calendar) calculations</li>
          <li>Zodiac and Nakshatra compatibility charts</li>
          <li>Numerology calculators, age calculators, and other astrology tools</li>
          <li>Personalized astrology remedy recommendations</li>
          <li>Educational blog content about Vedic astrology</li>
        </ul>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">3. Disclaimer of Astrological Predictions</h2>
        <p>All astrological predictions, interpretations, and recommendations provided on vivaai.in are for <strong className="text-white">entertainment and informational purposes only</strong>. They should not be considered as professional advice for legal, medical, financial, or other important life decisions. For such matters, always consult qualified professionals. See our full <a href="/disclaimer" className="text-gold-400 hover:underline">Disclaimer</a> for details.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">4. User Accounts & Responsibilities</h2>
        <p>If you create an account on our platform:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>You must provide accurate and complete information during registration.</li>
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
          <li>You are responsible for all activities that occur under your account.</li>
          <li>You must notify us immediately of any unauthorized use of your account.</li>
          <li>You must be at least 13 years old to create an account.</li>
        </ul>
        <p>We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">5. Free and Premium Services</h2>
        <h3 className="text-sm font-semibold text-white mt-3">5.1 Free Services</h3>
        <p>Most of our astrology tools are available for free, including Kundali generation, horoscope reading, Panchang, compatibility checking, and blog access. Free services require no account creation and have no usage limits.</p>
        <h3 className="text-sm font-semibold text-white mt-3">5.2 Premium Services</h3>
        <p>Premium features include downloadable PDF reports, ad-free experience, and extended analysis. Premium services are available via one-time purchases or subscription plans, with pricing clearly displayed before purchase.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">6. Payments, Billing & Refunds</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>All payments are processed securely through <strong className="text-white">Razorpay</strong>, India&apos;s leading payment gateway.</li>
          <li>Prices are displayed in Indian Rupees (INR) and include applicable taxes.</li>
          <li>Subscription plans auto-renew unless cancelled before the next billing date.</li>
          <li>You may cancel subscriptions at any time through your account settings.</li>
          <li>Refunds are governed by our <a href="/refund-policy" className="text-gold-400 hover:underline">Refund Policy</a>.</li>
        </ul>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">7. Intellectual Property</h2>
        <p>All content, designs, algorithms, text, graphics, logos, software, and other materials on vivaai.in are the intellectual property of VivaAI Astrology and are protected by Indian and international copyright, trademark, and other intellectual property laws.</p>
        <p>You may not:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Copy, reproduce, or distribute our content without written permission</li>
          <li>Reverse-engineer our algorithms or calculation methods</li>
          <li>Scrape or systematically download content from our website</li>
          <li>Use our brand name, logo, or trademarks without authorization</li>
        </ul>
        <p>You are granted a limited, non-exclusive, non-transferable license to access and use the Service for personal, non-commercial purposes.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">8. Prohibited Activities</h2>
        <p>When using our Service, you agree not to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use the Service for any illegal or unauthorized purpose</li>
          <li>Attempt to interfere with the Service&apos;s security or functionality</li>
          <li>Upload malicious code, viruses, or harmful content</li>
          <li>Impersonate another person or entity</li>
          <li>Use automated tools (bots, scrapers) to access the Service without permission</li>
          <li>Redistribute or resell astrological reports or content generated by our tools</li>
        </ul>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">9. Limitation of Liability</h2>
        <p>To the maximum extent permitted by applicable law, VivaAI Astrology and its team shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses, arising from:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Your use or inability to use the Service</li>
          <li>Any decisions made based on astrological content provided by the Service</li>
          <li>Unauthorized access to or alteration of your data</li>
          <li>Any errors, inaccuracies, or omissions in astrological predictions</li>
        </ul>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">10. Third-Party Services</h2>
        <p>Our Service may contain links to or integrations with third-party websites and services (including Razorpay, Google Analytics, and Google AdSense). We are not responsible for the content, privacy practices, or terms of these third-party services. Your use of such services is subject to their respective terms and policies.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">11. Governing Law & Dispute Resolution</h2>
        <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or the use of our Service shall be subject to the exclusive jurisdiction of the courts in India. We encourage users to contact us first to resolve disputes amicably before pursuing legal action.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">12. Contact Information</h2>
        <p>For questions about these Terms & Conditions, contact us at:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-white">Email:</strong> <a href="mailto:support@vivaai.in" className="text-gold-400 hover:underline">support@vivaai.in</a></li>
          <li><strong className="text-white">Website:</strong> <a href="https://vivaai.in/contact" className="text-gold-400 hover:underline">vivaai.in/contact</a></li>
        </ul>
      </div>
    </div>
  );
}
