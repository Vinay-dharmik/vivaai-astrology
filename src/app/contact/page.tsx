import { seoMeta } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Mail, Globe, MapPin, MessageSquare, Clock } from "lucide-react";

export const metadata = seoMeta({
  title: "Contact Us",
  path: "/contact",
  description: "Get in touch with VivaAI Astrology for support, feedback, billing queries, or business partnerships. We respond within 24-48 hours to all inquiries.",
});

export default function ContactPage() {
  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: "Contact Us" }]} />

      <h1 className="font-sora font-bold text-3xl gold-text mb-2">Contact Us</h1>
      <p className="text-[var(--text-muted)] mb-8">Have questions? We&apos;re here to help.</p>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {/* Contact Info Cards */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gold-200 uppercase tracking-wider">Get In Touch</h2>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold-400/10 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <div className="text-xs text-[var(--text-muted)]">Email</div>
              <a href="mailto:support@vivaai.in" className="text-sm text-white hover:text-gold-400 transition">support@vivaai.in</a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold-400/10 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <div className="text-xs text-[var(--text-muted)]">Website</div>
              <a href="https://vivaai.in" className="text-sm text-white hover:text-gold-400 transition">vivaai.in</a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold-400/10 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <div className="text-xs text-[var(--text-muted)]">Location</div>
              <span className="text-sm text-white">India</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold-400/10 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <div className="text-xs text-[var(--text-muted)]">Response Time</div>
              <span className="text-sm text-white">24-48 hours</span>
            </div>
          </div>
        </div>

        {/* FAQ Quick Help */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gold-200 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Common Questions
          </h2>

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Is the Kundali report accurate?</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Yes. We use Astronomy Engine with Lahiri Ayanamsa for precise sidereal calculations, matching traditional Vedic methods.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">How does the PDF download work?</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Generate your free Kundali, then pay ₹5 via Razorpay to download a complete branded PDF report with all details.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Can I get a refund?</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Yes. If the PDF fails to download after payment, contact us within 7 days for a full refund. See our{" "}
                <a href="/refund-policy" className="text-gold-400 hover:underline">refund policy</a>.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Is my data private?</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Absolutely. Birth details are processed locally in your browser and never stored on our servers. See our{" "}
                <a href="/privacy" className="text-gold-400 hover:underline">privacy policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Support categories */}
      <div className="glass-card-bright p-6">
        <h2 className="text-sm font-semibold text-gold-200 uppercase tracking-wider mb-4">Support Categories</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/[0.03] rounded-lg p-4">
            <h3 className="font-semibold text-white mb-1">🔧 Technical Support</h3>
            <p className="text-xs text-[var(--text-muted)]">Issues with Kundali generation, calculations, or website errors.</p>
            <a href="mailto:support@vivaai.in?subject=Technical%20Support" className="text-xs text-gold-400 hover:underline mt-2 inline-block">
              Email Support →
            </a>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-4">
            <h3 className="font-semibold text-white mb-1">💰 Billing & Payments</h3>
            <p className="text-xs text-[var(--text-muted)]">Payment failures, refund requests, or download issues.</p>
            <a href="mailto:support@vivaai.in?subject=Billing%20Query" className="text-xs text-gold-400 hover:underline mt-2 inline-block">
              Email Billing →
            </a>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-4">
            <h3 className="font-semibold text-white mb-1">🤝 Business</h3>
            <p className="text-xs text-[var(--text-muted)]">Partnerships, advertising, or collaboration proposals.</p>
            <a href="mailto:support@vivaai.in?subject=Business%20Inquiry" className="text-xs text-gold-400 hover:underline mt-2 inline-block">
              Email Business →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
