import { seoMeta } from "@/lib/seo/metadata";

export const metadata = seoMeta({ title: "Refund Policy", path: "/refund-policy",
  description: "VivaAI Astrology refund policy. Learn about our refund terms for Kundali PDF reports and premium subscriptions. Request refunds within 7 days of purchase." });

export default function RefundPolicyPage() {
  return (
    <div className="section-container py-12 max-w-3xl mx-auto">
      <h1 className="font-sora font-bold text-3xl gold-text mb-6">Refund Policy</h1>
      <div className="glass-card p-6 sm:p-8 space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm">
        <p>VivaAI Astrology values your satisfaction. This policy outlines our refund terms for premium services.</p>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">Subscription Refunds</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Monthly/yearly subscriptions can be cancelled anytime.</li>
          <li>Refunds are available within <strong>7 days</strong> of purchase if no premium reports have been downloaded.</li>
          <li>After 7 days, remaining subscription period remains active but is non-refundable.</li>
        </ul>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">One-Time Report Refunds</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>One-time report purchases are refundable within <strong>48 hours</strong> if the report has not been viewed or downloaded.</li>
          <li>Once a report is generated and delivered, it is non-refundable.</li>
        </ul>
        <h2 className="text-lg font-semibold text-gold-200 pt-2">How To Request a Refund</h2>
        <p>Contact us through our website with your order details. Refunds are processed within 5-7 business days via the original payment method.</p>
      </div>
    </div>
  );
}
