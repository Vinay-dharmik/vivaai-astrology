import { seoMeta } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata = seoMeta({ title: "Privacy Policy", path: "/privacy",
  description: "VivaAI Astrology privacy policy. Learn how we collect, use, protect, and share your personal data. Comprehensive data protection practices for our Vedic astrology platform." });

export default function PrivacyPage() {
  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: "Privacy Policy" }]} />
      <h1 className="font-sora font-bold text-3xl gold-text mb-6">Privacy Policy</h1>
      <div className="glass-card p-6 sm:p-8 space-y-5 text-[var(--text-secondary)] leading-relaxed text-sm">
        <p><em>Last updated: June 1, 2026</em></p>

        <p>VivaAI Astrology (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website <strong className="text-white">vivaai.in</strong> (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our astrology tools. Please read this policy carefully. By using our Service, you consent to the data practices described in this policy.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">1. Information We Collect</h2>
        <h3 className="text-sm font-semibold text-white mt-3">1.1 Personal Information You Provide</h3>
        <p>When you use our astrology tools (Kundali Generator, Matching, Horoscope, etc.), you may provide the following information:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Full name</li>
          <li>Date of birth</li>
          <li>Time of birth</li>
          <li>Place of birth</li>
          <li>Email address (for account creation or PDF delivery)</li>
        </ul>
        <p><strong className="text-gold-200">Important:</strong> For our free Kundali generator and most calculators, birth details are processed entirely in your browser using client-side JavaScript. This data is <strong className="text-white">not transmitted to or stored on our servers</strong> unless you explicitly create an account or purchase a premium report.</p>

        <h3 className="text-sm font-semibold text-white mt-3">1.2 Information Collected Automatically</h3>
        <p>When you access our website, we automatically collect certain information, including:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-white">Device Information:</strong> Browser type, operating system, device type, screen resolution</li>
          <li><strong className="text-white">Usage Data:</strong> Pages visited, time spent on each page, referring website, navigation patterns</li>
          <li><strong className="text-white">IP Address:</strong> Used for approximate geolocation, security, and analytics (anonymized where possible)</li>
          <li><strong className="text-white">Cookies and Tracking Technologies:</strong> As described in Section 5 below</li>
        </ul>

        <h3 className="text-sm font-semibold text-white mt-3">1.3 Payment Information</h3>
        <p>When you purchase premium services (PDF downloads, subscriptions), payment is processed by <strong className="text-white">Razorpay</strong>, our third-party payment processor. We do not store your credit card numbers, bank account details, or UPI IDs on our servers. Razorpay&apos;s privacy policy governs the handling of your payment information.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">2. How We Use Your Information</h2>
        <p>We use the information we collect for the following purposes:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Generate personalized Kundali reports, horoscopes, and astrological analyses</li>
          <li>Provide daily horoscope predictions and Panchang calculations</li>
          <li>Process payment transactions for premium services</li>
          <li>Deliver purchased PDF reports via email</li>
          <li>Improve our services, tools, and user experience</li>
          <li>Analyze website usage patterns through anonymized analytics</li>
          <li>Respond to customer support inquiries</li>
          <li>Prevent fraud and ensure website security</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">3. Data Sharing and Disclosure</h2>
        <p>We do <strong className="text-white">not sell, rent, or trade</strong> your personal information to third parties. We may share data only in the following circumstances:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-white">Payment Processing:</strong> Transaction data is shared with Razorpay to process payments securely.</li>
          <li><strong className="text-white">Analytics:</strong> Anonymized usage data is shared with Google Analytics to help us understand website traffic and improve our services.</li>
          <li><strong className="text-white">Advertising:</strong> We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads" className="text-gold-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
          <li><strong className="text-white">Legal Compliance:</strong> We may disclose information if required by law, court order, or government regulation.</li>
          <li><strong className="text-white">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, user data may be transferred as part of the business assets.</li>
        </ul>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">4. Data Retention</h2>
        <p>We retain personal data only for as long as necessary to provide our services and fulfill the purposes outlined in this policy:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-white">Account Data:</strong> Retained for as long as your account is active. You may request deletion at any time.</li>
          <li><strong className="text-white">Transaction Records:</strong> Retained for 7 years as required by Indian tax and accounting regulations.</li>
          <li><strong className="text-white">Analytics Data:</strong> Anonymized and retained for up to 26 months via Google Analytics.</li>
          <li><strong className="text-white">Free Tool Usage:</strong> Birth details entered in our free tools are processed in your browser and not retained by us.</li>
        </ul>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">5. Cookies and Tracking Technologies</h2>
        <p>We use cookies and similar technologies to enhance your experience:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-white">Essential Cookies:</strong> Required for website functionality, authentication, and security. Cannot be disabled.</li>
          <li><strong className="text-white">Analytics Cookies:</strong> Google Analytics cookies help us understand how users interact with our website. These collect anonymized data about page views, session duration, and navigation paths.</li>
          <li><strong className="text-white">Advertising Cookies:</strong> Google AdSense may place cookies to serve relevant advertisements. These cookies may track your browsing activity across websites to deliver personalized ads.</li>
          <li><strong className="text-white">Preference Cookies:</strong> Remember your settings, such as cookie consent preferences and theme choices.</li>
        </ul>
        <p>You can manage cookie preferences through your browser settings or our cookie consent banner. Note that disabling cookies may affect website functionality.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">6. Your Rights</h2>
        <p>You have the following rights regarding your personal data:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-white">Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong className="text-white">Correction:</strong> Request correction of inaccurate or incomplete data.</li>
          <li><strong className="text-white">Deletion:</strong> Request deletion of your personal data (subject to legal retention requirements).</li>
          <li><strong className="text-white">Portability:</strong> Request your data in a structured, machine-readable format.</li>
          <li><strong className="text-white">Opt-Out:</strong> Opt out of marketing communications and personalized advertising at any time.</li>
        </ul>
        <p>To exercise any of these rights, contact us at <a href="mailto:support@vivaai.in" className="text-gold-400 hover:underline">support@vivaai.in</a>. We will respond within 30 days.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">7. Children&apos;s Privacy</h2>
        <p>Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete it promptly. If you believe we may have collected information from a child under 13, please contact us immediately.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">8. Data Security</h2>
        <p>We implement industry-standard security measures to protect your personal data, including:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>SSL/TLS encryption for all data transmitted between your browser and our servers</li>
          <li>Encrypted storage for any personal data retained on our servers</li>
          <li>Regular security audits and vulnerability assessments</li>
          <li>Access controls limiting employee access to personal data</li>
        </ul>
        <p>However, no method of internet transmission or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">9. Third-Party Services</h2>
        <p>Our website integrates with the following third-party services, each governed by their own privacy policies:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-white">Google Analytics</strong> — Website analytics and usage tracking</li>
          <li><strong className="text-white">Google AdSense</strong> — Display advertising</li>
          <li><strong className="text-white">Razorpay</strong> — Payment processing</li>
          <li><strong className="text-white">NextAuth.js</strong> — Authentication (if account features are used)</li>
        </ul>
        <p>We encourage you to review the privacy policies of these third-party services.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">10. Changes to This Policy</h2>
        <p>We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. We will notify you of significant changes by posting a prominent notice on our website and updating the &quot;Last updated&quot; date. Your continued use of the Service after changes constitutes acceptance of the updated policy.</p>

        <h2 className="text-lg font-semibold text-gold-200 pt-2">11. Contact Us</h2>
        <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-white">Email:</strong> <a href="mailto:support@vivaai.in" className="text-gold-400 hover:underline">support@vivaai.in</a></li>
          <li><strong className="text-white">Website:</strong> <a href="https://vivaai.in/contact" className="text-gold-400 hover:underline">vivaai.in/contact</a></li>
        </ul>
      </div>
    </div>
  );
}
