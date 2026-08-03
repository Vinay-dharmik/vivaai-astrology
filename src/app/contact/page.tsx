import { seoMeta } from "@/lib/seo/metadata";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Mail, Globe, MapPin, MessageSquare, Clock, Send, Shield, BookOpen } from "lucide-react";
import Link from "next/link";

export const metadata = seoMeta({
  title: "Contact Us — VivaAI Astrology Support & Business Inquiries",
  path: "/contact",
  description: "Get in touch with VivaAI Astrology for technical support, feedback, billing queries, or business partnerships. We respond within 24-48 hours to all inquiries.",
});

export default function ContactPage() {
  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: "Contact Us" }]} />

      <h1 className="font-sora font-bold text-3xl gold-text mb-2">Contact Us</h1>
      <p className="text-[var(--text-secondary)] mb-8 text-sm leading-relaxed max-w-2xl">
        We value every interaction with our users. Whether you have a technical question about your Kundali report, need help with a payment, want to report an issue, or are interested in partnering with us — we&apos;re here to help. Our support team responds to all inquiries within <strong className="text-white">24-48 hours</strong>.
      </p>

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
                The astronomy is verified against published equinox, solstice and eclipse timings — Sun within 0.4 arcminutes, Moon within 0.9 — using Meeus’s algorithms and the Lahiri Ayanamsa. The interpretation follows classical Vedic rules. Astrological prediction itself is not scientifically validated; please read our disclaimer.
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

      {/* Contact Form */}
      <div className="glass-card-bright p-6 sm:p-8 mb-8">
        <h2 className="text-lg font-sora font-bold text-gold-200 mb-1 flex items-center gap-2">
          <Send className="w-4 h-4" /> Send Us a Message
        </h2>
        <p className="text-xs text-[var(--text-muted)] mb-6">Fill out the form below and we&apos;ll get back to you within 24-48 hours.</p>

        <form
          action="mailto:support@vivaai.in"
          method="POST"
          encType="text/plain"
          className="space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name" className="text-xs text-[var(--text-muted)] block mb-1">Your Name *</label>
              <input
                id="contact-name"
                name="Name"
                type="text"
                required
                placeholder="Enter your full name"
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-[var(--border)] text-sm text-white placeholder:text-[var(--text-muted)] focus:border-gold-400/50 focus:outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="text-xs text-[var(--text-muted)] block mb-1">Email Address *</label>
              <input
                id="contact-email"
                name="Email"
                type="email"
                required
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-[var(--border)] text-sm text-white placeholder:text-[var(--text-muted)] focus:border-gold-400/50 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-subject" className="text-xs text-[var(--text-muted)] block mb-1">Subject *</label>
            <select
              id="contact-subject"
              name="Subject"
              required
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-[var(--border)] text-sm text-white focus:border-gold-400/50 focus:outline-none transition"
            >
              <option value="" className="bg-[#0a0b14]">Select a topic</option>
              <option value="Technical Support" className="bg-[#0a0b14]">Technical Support</option>
              <option value="Billing & Payments" className="bg-[#0a0b14]">Billing & Payments</option>
              <option value="Refund Request" className="bg-[#0a0b14]">Refund Request</option>
              <option value="Bug Report" className="bg-[#0a0b14]">Bug Report</option>
              <option value="Feature Request" className="bg-[#0a0b14]">Feature Request</option>
              <option value="Business Partnership" className="bg-[#0a0b14]">Business Partnership</option>
              <option value="General Inquiry" className="bg-[#0a0b14]">General Inquiry</option>
            </select>
          </div>

          <div>
            <label htmlFor="contact-message" className="text-xs text-[var(--text-muted)] block mb-1">Message *</label>
            <textarea
              id="contact-message"
              name="Message"
              required
              rows={5}
              placeholder="Describe your query in detail..."
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-[var(--border)] text-sm text-white placeholder:text-[var(--text-muted)] focus:border-gold-400/50 focus:outline-none transition resize-none"
            />
          </div>

          <button
            type="submit"
            className="gold-btn px-6 py-2.5 text-sm inline-flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Send Message
          </button>
        </form>
      </div>

      {/* Support categories */}
      <div className="glass-card-bright p-6 mb-8">
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

      {/* Helpful links */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-gold-200 uppercase tracking-wider mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Helpful Resources
        </h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <Link href="/privacy" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-gold-400 transition">
            <Shield className="w-3 h-3 text-gold-400" /> Privacy Policy
          </Link>
          <Link href="/terms" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-gold-400 transition">
            <Shield className="w-3 h-3 text-gold-400" /> Terms & Conditions
          </Link>
          <Link href="/refund-policy" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-gold-400 transition">
            <Shield className="w-3 h-3 text-gold-400" /> Refund Policy
          </Link>
          <Link href="/disclaimer" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-gold-400 transition">
            <Shield className="w-3 h-3 text-gold-400" /> Disclaimer
          </Link>
        </div>
      </div>
    </div>
  );
}
