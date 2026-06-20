"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CreditCard, FileText, Globe, TrendingUp, BarChart3, Star,
  DollarSign, CheckCircle, XCircle, Activity, ArrowUpRight, ExternalLink, RefreshCw, BookOpen
} from "lucide-react";
import Link from "next/link";

interface Txn {
  id: string; amount: number; status: string; method: string;
  contact: string | null; product: string; createdAt: number;
}
interface Stats {
  configured: boolean;
  revenue: number; capturedCount: number; failedCount: number;
  totalAttempts: number; successRate: number;
  dailyRevenue: { date: string; amount: number }[];
  recent: Txn[];
  error?: string;
}

const PRODUCT_LABELS: Record<string, string> = { pdf: "Kundali PDF", matching: "Matching PDF", other: "Payment" };

function timeAgo(ms: number): string {
  const m = Math.floor((Date.now() - ms) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} d ago`;
}

function StatCard({ icon: Icon, label, value, color, hint }: {
  icon: React.ElementType; label: string; value: string; color: string; hint?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(15,15,30,0.8)" }}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white font-sora">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}{hint ? ` • ${hint}` : ""}</p>
    </div>
  );
}

function QuickAction({ icon: Icon, label, href, color, external }: {
  icon: React.ElementType; label: string; href: string; color: string; external?: boolean;
}) {
  const inner = (
    <>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}><Icon className="w-4 h-4" /></div>
      <span className="text-sm text-gray-300 group-hover:text-white transition flex-1">{label}</span>
      {external && <ExternalLink className="w-3.5 h-3.5 text-gray-600" />}
    </>
  );
  const cls = "flex items-center gap-3 p-4 rounded-xl border border-white/10 hover:border-white/20 transition group";
  const style = { background: "rgba(15,15,30,0.8)" };
  return external
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{inner}</a>
    : <Link href={href} className={cls} style={style}>{inner}</Link>;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/vinayd/login");
  }, [status, router]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats?days=90", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch { /* network error — keep prior state */ }
    finally { setLoading(false); }
  };

  useEffect(() => { if (status === "authenticated") load(); }, [status]);

  if (status === "loading") {
    return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-gold-400">Loading dashboard…</div></div>;
  }
  if (!session) return null;

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const firstName = session.user?.name?.split(" ")[0] || "Admin";

  const revenue = stats?.configured ? `₹${stats.revenue.toLocaleString("en-IN")}` : "—";
  const sales = stats?.configured ? String(stats.capturedCount) : "—";
  const successRate = stats?.configured ? `${stats.successRate}%` : "—";
  const failed = stats?.configured ? String(stats.failedCount) : "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sora font-bold text-2xl text-white">{greeting}, {firstName} 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Live revenue from Razorpay. Traffic data lives in your linked dashboards below.</p>
        </div>
        <button type="button" onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-white/10 text-gray-300 hover:bg-white/5 transition disabled:opacity-60 self-start">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Real revenue stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Revenue" hint="90d" value={revenue} color="bg-emerald-500/20 text-emerald-400" />
        <StatCard icon={CheckCircle} label="Successful Sales" hint="90d" value={sales} color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={TrendingUp} label="Success Rate" value={successRate} color="bg-purple-500/20 text-purple-400" />
        <StatCard icon={XCircle} label="Failed Payments" hint="90d" value={failed} color="bg-red-500/20 text-red-400" />
      </div>

      {!stats?.configured && (
        <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/5 p-4 text-sm text-yellow-300/90">
          Razorpay keys not detected. Add <code className="bg-white/10 px-1 rounded">RAZORPAY_KEY_ID</code> and <code className="bg-white/10 px-1 rounded">RAZORPAY_KEY_SECRET</code> in Vercel → revenue will populate automatically.
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions — internal + real external dashboards */}
        <div className="lg:col-span-1">
          <h2 className="font-sora font-semibold text-sm text-white mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <QuickAction icon={FileText} label="Create Blog Post" href="/vinayd/blogs/new" color="bg-blue-500/20 text-blue-400" />
            <QuickAction icon={CreditCard} label="View Payments" href="/vinayd/payments" color="bg-emerald-500/20 text-emerald-400" />
            <QuickAction icon={BarChart3} label="Google Analytics" href="https://analytics.google.com" color="bg-orange-500/20 text-orange-400" external />
            <QuickAction icon={Globe} label="Search Console" href="https://search.google.com/search-console" color="bg-cyan-500/20 text-cyan-400" external />
            <QuickAction icon={DollarSign} label="AdSense" href="https://www.google.com/adsense" color="bg-gold-400/20 text-gold-400" external />
          </div>
        </div>

        {/* Recent Activity — REAL recent payments */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-sora font-semibold text-sm text-white">Recent Payments</h2>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> Live
            </span>
          </div>
          <div className="rounded-xl border border-white/10 p-4" style={{ background: "rgba(15,15,30,0.8)" }}>
            {!stats?.configured ? (
              <p className="text-sm text-gray-500 py-6 text-center">Connect Razorpay to see live payments.</p>
            ) : stats.recent.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">No payments yet. Your first sale will appear here in real time.</p>
            ) : (
              stats.recent.slice(0, 7).map((p) => (
                <div key={p.id} className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    p.status === "captured" ? "bg-emerald-500/20 text-emerald-400" :
                    p.status === "failed" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    <CreditCard className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300">
                      {p.status === "captured" ? "Payment received" : p.status === "failed" ? "Payment failed" : "Payment " + p.status}
                      {" "}— ₹{p.amount.toFixed(0)} {PRODUCT_LABELS[p.product] || p.product}
                    </p>
                    <p className="text-[0.6rem] text-gray-600 mt-0.5">{p.contact || "—"} • {timeAgo(p.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Traffic note — honest pointer to real dashboards */}
      <div className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(15,15,30,0.8)" }}>
        <h2 className="font-sora font-semibold text-sm text-white mb-2 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-gold-400" /> Traffic & SEO
        </h2>
        <p className="text-xs text-gray-400 mb-3">
          Page views, sessions, and search impressions are tracked in Google&apos;s tools (no on-site database stores them). Open them directly:
        </p>
        <div className="flex flex-wrap gap-2">
          <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition flex items-center gap-1.5">GA4 Realtime <ExternalLink className="w-3 h-3" /></a>
          <a href="https://search.google.com/search-console/performance/search-analytics" target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition flex items-center gap-1.5">Search Performance <ExternalLink className="w-3 h-3" /></a>
          <a href="https://search.google.com/search-console/index" target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition flex items-center gap-1.5">Index Coverage <ExternalLink className="w-3 h-3" /></a>
        </div>
      </div>
    </div>
  );
}
