"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, AlertCircle, CheckCircle, Shield } from "lucide-react";
import type { KundaliData } from "./KundaliForm";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function KundaliResult({ data }: { data: KundaliData }) {
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const isPaid = paymentStatus === "success";

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) { resolve(); return; }
      if (document.getElementById("razorpay-script")) {
        const existing = document.getElementById("razorpay-script") as HTMLScriptElement;
        existing.onload = () => resolve();
        existing.onerror = () => reject(new Error("Failed to load Razorpay"));
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
      document.head.appendChild(script);
    });
  };

  const handleUnlock = async () => {
    setPaymentStatus("loading");
    setErrorMsg("");

    try {
      await loadRazorpayScript();

      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "pdf",  // ₹19 — server validates & sets amount
          notes: { name: data.name, product: "Kundali Premium Report" },
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({ error: "Order creation failed" }));
        throw new Error(err.error || "Failed to create payment order");
      }

      const { order_id, amount, currency } = await orderRes.json();
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!keyId) throw new Error("Payment key not configured");

      const options = {
        key: keyId,
        amount,
        currency,
        name: "VivaAI Astrology",
        description: `Premium Kundali Report — ${data.name}`,
        image: "/favicon.svg",
        order_id,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              const err = await verifyRes.json().catch(() => ({ error: "Verification failed" }));
              throw new Error(err.error || "Payment verification failed");
            }

            const result = await verifyRes.json();
            if (result.verified) {
              setPaymentStatus("success");
              // Auto-download PDF after payment
              const { generateKundaliPDF } = await import("@/lib/pdf/kundaliPDF");
              generateKundaliPDF(data);
            } else {
              throw new Error("Payment could not be verified");
            }
          } catch (verifyErr: any) {
            setPaymentStatus("error");
            setErrorMsg(verifyErr.message || "Payment verification failed. Contact support.");
          }
        },
        prefill: { name: data.name },
        theme: { color: "#ffb347" },
        modal: { ondismiss: () => setPaymentStatus("idle") },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setPaymentStatus("error");
        setErrorMsg(response.error?.description || "Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err: any) {
      setPaymentStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} id="kundali-report"
      className="glass-card-bright p-6 sm:p-8 mt-8 space-y-8">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <h2 className="font-sora font-bold text-xl gold-text">{data.name} — Vedic Kundali Report</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {data.dob} at {data.time} • {data.place} • Ayanamsa: {data.ayanamsa.toFixed(4)}° (Lahiri)
          </p>
        </div>
        {isPaid ? (
          <div className="flex items-center gap-2 text-mystic-green text-sm font-semibold">
            <CheckCircle className="w-4 h-4" /> PDF Downloaded
          </div>
        ) : (
          <button onClick={handleUnlock} disabled={paymentStatus === "loading"}
            className="gold-btn text-sm px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-60 shadow-glow">
            {paymentStatus === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {paymentStatus === "loading" ? "Processing..." : "Download PDF — ₹19"}
          </button>
        )}
      </div>

      {/* ═══════ FREE SECTION — Always visible ═══════ */}

      {/* Birth Chart Summary — FREE */}
      <Section title="Birth Chart Summary" badge="FREE">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <Card label="Lagna (Ascendant)" value={`${data.lagna.name} (${data.lagna.english})`} sub={`Lord: ${data.lagna.lord} • ${data.lagna.degree.toFixed(1)}°`} />
          <Card label="Moon Sign (Rashi)" value={`${data.moonSign.name} (${data.moonSign.english})`} sub={`Lord: ${data.moonSign.lord}`} />
          <Card label="Sun Sign" value={`${data.sunSign.name} (${data.sunSign.english})`} sub={`Lord: ${data.sunSign.lord}`} />
          <Card label="Nakshatra" value={`${data.nakshatra.name} Pada ${data.nakshatra.pada}`} sub={`Lord: ${data.nakshatra.lord}`} />
          <Card label="Deity" value={data.nakshatra.deity} sub="Nakshatra Deity" />
          <Card label="Gana" value={data.nakshatra.gana} sub="Temperament" />
          <Card label="Nadi" value={data.nakshatra.nadi} sub="Constitution" />
          <Card label="Yoni" value={data.nakshatra.yoni} sub="Animal symbol" />
        </div>
      </Section>

      {/* Vimshottari Dasha — FREE (basic) */}
      <Section title="Vimshottari Dasha" badge="FREE">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Card label="Mahadasha" value={data.dasha.current} sub={data.dasha.currentRange} highlight />
          <Card label="Antardasha" value={data.dasha.antardasha} sub="Current sub-period" />
          <Card label="Next Mahadasha" value={data.dasha.next} sub={`Starts at ${data.dasha.nextStartsAt} yrs`} />
        </div>
      </Section>

      {/* Planetary Positions — All 9 planets visible for free */}
      <Section title="Planetary Positions (Sidereal — Lahiri)" badge="FREE">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-400/20">
                <Th>Planet</Th><Th>Longitude</Th><Th>Rashi</Th><Th>Nakshatra</Th><Th>House</Th><Th>Status</Th><Th>Dignity</Th>
              </tr>
            </thead>
            <tbody>
              {data.planets.map((p) => (
                <tr key={p.body} className="border-b border-[var(--border)] hover:bg-white/[0.02]">
                  <Td bold>{p.body} {p.isRetrograde ? <span className="text-red-400 text-xs">(R)</span> : ""}</Td>
                  <Td>{p.lon.toFixed(2)}°</Td>
                  <Td>{p.rashi} ({p.rashiEnglish})</Td>
                  <Td>{p.nakshatra} P{p.nakshatraPada}</Td>
                  <Td>{p.house}</Td>
                  <Td>{p.isRetrograde ? <span className="text-red-400">Retrograde ↺</span> : <span className="text-mystic-green">Direct →</span>}</Td>
                  <Td>{p.dignity === "Exalted ⬆" ? <span className="text-mystic-green">{p.dignity}</span> : p.dignity === "Debilitated ⬇" ? <span className="text-red-400">{p.dignity}</span> : p.dignity === "Own Sign ★" ? <span className="text-gold-400">{p.dignity}</span> : p.dignity}</Td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </Section>

      {/* ═══════ ALL CONTENT FREE ═══════ */}

      {/* Dosha Analysis */}
      <LockedSection title="Dosha Analysis (Manglik, Kaal Sarp, Sade Sati)" isPaid={isPaid} onUnlock={handleUnlock} paymentStatus={paymentStatus}>
        <div className="space-y-3">
          <DoshaCard title="Manglik Dosha" active={data.doshas.manglik.status} severity={data.doshas.manglik.severity} text={data.doshas.manglik.details} />
          <DoshaCard title="Kaal Sarp Dosha" active={data.doshas.kaalSarp.status} severity={data.doshas.kaalSarp.status ? "Active" : "None"} text={data.doshas.kaalSarp.details} />
          <DoshaCard title="Sade Sati" active={data.doshas.sadeSati.status} severity={data.doshas.sadeSati.phase} text={data.doshas.sadeSati.details} />
        </div>
      </LockedSection>

      {/* House Chart — LOCKED */}
      <LockedSection title="Bhava (House) Chart — All 12 Houses" isPaid={isPaid} onUnlock={handleUnlock} paymentStatus={paymentStatus}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {data.houses.map((h) => (
            <div key={h.house} className="bg-white/[0.03] border border-[var(--border)] rounded-lg p-2.5 text-center">
              <div className="text-[0.6rem] text-[var(--text-muted)] uppercase">House {h.house}</div>
              <div className="text-xs font-semibold text-white">{h.sign} ({h.signEnglish})</div>
              <div className="text-[0.6rem] text-gold-400">Lord: {h.lord}</div>
              {h.planets.length > 0 && <div className="text-[0.6rem] text-mystic-green mt-1">{h.planets.join(", ")}</div>}
            </div>
          ))}
        </div>
      </LockedSection>

      {/* Yoga Analysis — LOCKED */}
      <LockedSection title="Yoga Analysis (Raj Yoga, Gajakesari, Budhaditya & More)" isPaid={isPaid} onUnlock={handleUnlock} paymentStatus={paymentStatus}>
        <div className="space-y-2">
          {data.yogas.map((y, i) => (
            <div key={i} className={`rounded-lg p-3 border-l-4 ${y.formed ? "bg-mystic-green/5 border-mystic-green" : "bg-white/[0.02] border-[var(--border)]"}`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-white">{y.name}</span>
                {y.formed && <span className="text-xs text-mystic-green bg-mystic-green/10 px-2 py-0.5 rounded-full">Active</span>}
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">Planets: {y.planets}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{y.effect}</p>
            </div>
          ))}
        </div>
      </LockedSection>

      {/* Life Predictions — LOCKED */}
      <LockedSection title="Detailed Life Predictions (Career, Marriage, Health, Finance)" isPaid={isPaid} onUnlock={handleUnlock} paymentStatus={paymentStatus}>
        <div className="space-y-4">
          <PredBlock icon="🧠" title="Personality & Temperament" text={data.personality} />
          <PredBlock icon="💼" title="Career & Profession" text={data.career} />
          <PredBlock icon="💰" title="Finance & Wealth" text={data.finance} />
          <PredBlock icon="💍" title="Marriage & Relationships" text={data.marriage} />
          <PredBlock icon="🏥" title="Health & Wellness" text={data.health} />
          <PredBlock icon="🕉️" title="Spiritual Path" text={data.spiritual} />
        </div>
      </LockedSection>

      {/* Challenges & Solutions — LOCKED */}
      <LockedSection title="Challenges & Solutions" isPaid={isPaid} onUnlock={handleUnlock} paymentStatus={paymentStatus}>
        <ul className="space-y-1.5 mb-4">
          {data.positives.map((p, i) => (
            <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2"><span className="text-mystic-green">✦</span> {p}</li>
          ))}
        </ul>
        {data.challenges.map((c, i) => (
          <div key={i} className="bg-white/[0.02] border-l-4 border-gold-400/50 pl-4 py-3 rounded-r-lg mb-3">
            <p className="text-sm text-[var(--text-secondary)]"><strong className="text-gold-200">⚠ Challenge:</strong> {c.issue}</p>
            <p className="text-sm text-[var(--text-muted)] mt-1"><strong className="text-mystic-green">✓ Solution:</strong> {c.solution}</p>
          </div>
        ))}
      </LockedSection>

      {/* Gemstones & Remedies — LOCKED */}
      <LockedSection title="Gemstone Recommendations & Personalized Remedies" isPaid={isPaid} onUnlock={handleUnlock} paymentStatus={paymentStatus}>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {data.luckyGems.map((g) => (
            <div key={g.planet} className="bg-white/[0.03] rounded-lg p-3 flex items-center gap-3">
              <div className="text-2xl">💎</div>
              <div>
                <div className="text-sm font-semibold text-white">{g.name}</div>
                <div className="text-xs text-[var(--text-muted)]">For {g.planet} • Wear on {g.finger}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card label="Lucky Numbers" value={data.luckyNumbers.join(", ")} />
          <Card label="Lucky Colors" value={data.luckyColors.join(", ")} />
          <Card label="Lucky Day" value={data.luckyDay} />
        </div>
        <ul className="space-y-2">
          {data.remedies.map((r, i) => (
            <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2"><span className="text-gold-400">•</span> {r}</li>
          ))}
        </ul>
      </LockedSection>

      {/* Bottom CTA */}
      <div className="text-center border-t border-[var(--border)] pt-6">
        {isPaid ? (
          <div>
            <div className="flex items-center justify-center gap-2 text-mystic-green mb-3">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Premium report unlocked! PDF downloaded.</span>
            </div>
            <button onClick={async () => { const { generateKundaliPDF } = await import("@/lib/pdf/kundaliPDF"); generateKundaliPDF(data); }}
              className="text-sm text-gold-400 hover:underline flex items-center gap-1 mx-auto">
              <Download className="w-4 h-4" /> Download PDF Again
            </button>
          </div>
        ) : (
          <>
            <div className="glass-card p-6 rounded-2xl border-gold-400/30 bg-gradient-to-b from-gold-400/5 to-transparent mb-4">
              <div className="text-xs text-gold-200 uppercase tracking-wider mb-2 font-semibold">📄 Save Your Report as PDF</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-[var(--text-secondary)] mb-4">
                {["All content shown above", "Print-ready format", "Share with family", "Offline access", "Professional layout", "Keep forever"].map(f => (
                  <div key={f} className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-mystic-green shrink-0" />{f}</div>
                ))}
              </div>
              <button onClick={handleUnlock} disabled={paymentStatus === "loading"}
                className="gold-btn px-10 py-3.5 rounded-xl text-lg font-bold flex items-center justify-center gap-2 mx-auto shadow-glow disabled:opacity-60">
                {paymentStatus === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                {paymentStatus === "loading" ? "Creating order..." : "Download Full PDF — ₹19"}
              </button>
              <p className="text-xs text-[var(--text-muted)] mt-3 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" /> Secure payment via Razorpay • Instant delivery • PDF download included
              </p>
            </div>
          </>
        )}
        {paymentStatus === "error" && errorMsg && (
          <div className="mt-3 text-sm text-red-400 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}
      </div>

      {/* WhatsApp Viral Share */}
      <div className="text-center border-t border-[var(--border)] pt-6">
        <p className="text-xs text-[var(--text-muted)] mb-3">Share your chart with friends & family</p>
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔮 I just got my free Vedic Kundali on VivaAI!\n\n⭐ Lagna: ${data.lagna.name} (${data.lagna.english})\n🌙 Moon: ${data.moonSign.name}\n✨ Nakshatra: ${data.nakshatra.name} Pada ${data.nakshatra.pada}\n🪐 Mahadasha: ${data.dasha.current}\n\nGet yours free → https://vivaai.in/kundali`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-semibold text-sm transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Share on WhatsApp
        </a>
      </div>

      <p className="text-xs text-[var(--text-muted)] text-center pt-4 border-t border-[var(--border)]">
        Calculated using Astronomy Engine + Lahiri Ayanamsa ({data.ayanamsa.toFixed(4)}°).
        For major life decisions, consult a qualified Vedic astrologer.
      </p>
    </motion.div>
  );
}

// ── Locked Section with blur overlay ──────────────

function LockedSection({ title, isPaid, onUnlock, paymentStatus, children }: {
  title: string; isPaid: boolean; onUnlock: () => void; paymentStatus: string; children: React.ReactNode;
}) {
  // Free-first model — all content always visible, no paywall
  return <Section title={title} badge="FREE">{children}</Section>;
}

// ── Sub-components ───────────────────────

function Section({ title, children, badge }: { title: string; children: React.ReactNode; badge?: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xs text-gold-200 uppercase tracking-wider font-semibold">{title}</h3>
        {badge && (
          <span className={`text-[0.6rem] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
            badge === "FREE" ? "bg-mystic-green/10 text-mystic-green" :
            badge === "PREVIEW" ? "bg-gold-400/10 text-gold-400" :
            "bg-mystic-purple/10 text-mystic-purple"
          }`}>{badge}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function Card({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`border rounded-xl p-3 text-center ${highlight ? "border-gold-400/40 bg-gold-400/5" : "border-[var(--border)] bg-[rgba(8,6,14,0.5)]"}`}>
      <div className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm font-semibold text-white">{value}</div>
      {sub && <div className="text-[0.6rem] text-[var(--text-muted)] mt-0.5">{sub}</div>}
    </div>
  );
}

function DoshaCard({ title, active, severity, text }: { title: string; active: boolean; severity: string; text: string }) {
  return (
    <div className={`rounded-lg p-4 border-l-4 ${active ? "border-red-400 bg-red-400/5" : "border-mystic-green bg-mystic-green/5"}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-sm text-white">{title}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${active ? "bg-red-400/20 text-red-400" : "bg-mystic-green/20 text-mystic-green"}`}>
          {active ? severity : "Not Present"}
        </span>
      </div>
      <p className="text-xs text-[var(--text-muted)]">{text}</p>
    </div>
  );
}

function PredBlock({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="bg-white/[0.02] border-l-4 border-gold-400/30 pl-4 py-3 rounded-r-lg">
      <h4 className="text-sm font-semibold text-gold-200 mb-1">{icon} {title}</h4>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{text}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left py-2 px-2 text-gold-200 font-medium text-xs uppercase">{children}</th>;
}

function Td({ children, bold }: { children: React.ReactNode; bold?: boolean }) {
  return <td className={`py-2 px-2 text-xs ${bold ? "text-white font-medium" : "text-[var(--text-secondary)]"}`}>{children}</td>;
}
