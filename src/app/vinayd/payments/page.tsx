"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, CheckCircle, XCircle, RefreshCw, AlertTriangle, ExternalLink } from "lucide-react";

interface Txn {
  id: string; orderId: string | null; amount: number; currency: string;
  status: string; method: string; contact: string | null; email: string | null;
  product: string; createdAt: number;
}

interface Stats {
  configured: boolean;
  revenue: number;
  capturedCount: number;
  refundedCount: number;
  failedCount: number;
  totalAttempts: number;
  successRate: number;
  byProduct: Record<string, { count: number; revenue: number }>;
  recent: Txn[];
  error?: string;
}

const PRODUCT_LABELS: Record<string, string> = { pdf: "Kundali PDF", matching: "Matching PDF", other: "Other" };

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} d ago`;
}

export default function AdminPaymentsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/vinayd/login");
  }, [status, router]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/stats?days=90", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setStats(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (status === "authenticated") load(); }, [status]);

  if (status === "loading" || !stats && loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-gold-400">Loading live payment data…</div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-sora font-bold text-2xl text-white">Payments</h1>
          <p className="text-sm text-gray-500 mt-1">Live data from Razorpay — last 90 days.</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://dashboard.razorpay.com/app/payments" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-white/10 text-gray-300 hover:bg-white/5 transition">
            Razorpay <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button type="button" onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gold-400 text-black hover:bg-gold-500 transition disabled:opacity-60">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-400 font-medium">Could not load Razorpay data</p>
            <p className="text-xs text-gray-400 mt-1">{error}</p>
          </div>
        </div>
      )}

      {stats && !stats.configured && (
        <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/5 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-400 font-medium">Razorpay keys not configured</p>
            <p className="text-xs text-gray-400 mt-1">Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment to see live revenue.</p>
          </div>
        </div>
      )}

      {stats && stats.configured && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={DollarSign} label="Revenue (90d)" value={`₹${stats.revenue.toLocaleString("en-IN")}`} color="bg-emerald-500/20 text-emerald-400" />
            <StatCard icon={CheckCircle} label="Successful" value={String(stats.capturedCount)} color="bg-blue-500/20 text-blue-400" />
            <StatCard icon={XCircle} label="Failed" value={String(stats.failedCount)} color="bg-red-500/20 text-red-400" />
            <StatCard icon={TrendingUp} label="Success Rate" value={`${stats.successRate}%`} color="bg-purple-500/20 text-purple-400" />
          </div>

          {/* Product breakdown */}
          <div>
            <h2 className="font-sora font-semibold text-sm text-white mb-3">Revenue by Product</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {Object.keys(stats.byProduct).length === 0 ? (
                <p className="text-sm text-gray-500 col-span-3">No captured payments yet in this window.</p>
              ) : (
                Object.entries(stats.byProduct).map(([key, v]) => (
                  <div key={key} className="rounded-xl border border-white/10 p-4 text-center" style={{ background: "rgba(15,15,30,0.8)" }}>
                    <p className="text-xs text-gray-500">{PRODUCT_LABELS[key] || key}</p>
                    <p className="text-lg font-bold gold-text font-sora">₹{v.revenue.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-gray-400 mt-1">{v.count} sale{v.count !== 1 ? "s" : ""}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent payments */}
          <div>
            <h2 className="font-sora font-semibold text-sm text-white mb-3">Recent Transactions</h2>
            <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "rgba(15,15,30,0.8)" }}>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-gray-500">
                    <th className="text-left p-3 font-medium">Payment ID</th>
                    <th className="text-left p-3 font-medium hidden sm:table-cell">Contact</th>
                    <th className="text-left p-3 font-medium">Product</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Method</th>
                    <th className="text-right p-3 font-medium">Amount</th>
                    <th className="text-center p-3 font-medium">Status</th>
                    <th className="text-right p-3 font-medium hidden md:table-cell">When</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {stats.recent.length === 0 ? (
                    <tr><td colSpan={7} className="p-6 text-center text-gray-500 text-sm">No transactions yet. They&apos;ll appear here as soon as the first payment comes in.</td></tr>
                  ) : (
                    stats.recent.map((p) => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                        <td className="p-3 font-mono text-xs text-gray-400">{p.id}</td>
                        <td className="p-3 text-xs text-gray-400 hidden sm:table-cell">{p.contact || p.email || "—"}</td>
                        <td className="p-3 text-xs text-white">{PRODUCT_LABELS[p.product] || p.product}</td>
                        <td className="p-3 text-xs text-gray-400 hidden md:table-cell capitalize">{p.method}</td>
                        <td className="p-3 text-right text-white font-medium">₹{p.amount.toFixed(0)}</td>
                        <td className="p-3 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            p.status === "captured" ? "bg-emerald-400/10 text-emerald-400" :
                            p.status === "failed" ? "bg-red-400/10 text-red-400" :
                            p.status === "refunded" ? "bg-purple-400/10 text-purple-400" :
                            "bg-yellow-400/10 text-yellow-400"
                          }`}>{p.status}</span>
                        </td>
                        <td className="p-3 text-right text-xs text-gray-500 hidden md:table-cell">{timeAgo(p.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(15,15,30,0.8)" }}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color} mb-3`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <p className="text-2xl font-bold text-white font-sora">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
