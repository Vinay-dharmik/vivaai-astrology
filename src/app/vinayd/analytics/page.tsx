"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BarChart3, TrendingUp, Eye, Users, Globe, Clock, Smartphone, Monitor, ArrowUpRight } from "lucide-react";

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/vinayd/login");
  }, [status, router]);

  if (status === "loading" || !session) return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-gold-400">Loading...</div></div>;

  const trafficSources = [
    { source: "Google Organic", sessions: "5,231", pct: "62%", color: "bg-blue-400" },
    { source: "Direct", sessions: "1,847", pct: "22%", color: "bg-emerald-400" },
    { source: "WhatsApp Referral", sessions: "723", pct: "9%", color: "bg-green-400" },
    { source: "Social Media", sessions: "412", pct: "5%", color: "bg-purple-400" },
    { source: "Other", sessions: "219", pct: "2%", color: "bg-gray-400" },
  ];

  const topCountries = [
    { country: "🇮🇳 India", sessions: "7,124", pct: "84%" },
    { country: "🇺🇸 United States", sessions: "543", pct: "6%" },
    { country: "🇬🇧 United Kingdom", sessions: "312", pct: "4%" },
    { country: "🇨🇦 Canada", sessions: "187", pct: "2%" },
    { country: "🇦🇺 Australia", sessions: "134", pct: "2%" },
    { country: "🇳🇵 Nepal", sessions: "98", pct: "1%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sora font-bold text-2xl text-white">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Traffic insights and user behavior analysis.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Eye, label: "Page Views", value: "42,891", change: "+23%", color: "bg-blue-500/20 text-blue-400" },
          { icon: Users, label: "Unique Visitors", value: "18,432", change: "+15%", color: "bg-emerald-500/20 text-emerald-400" },
          { icon: Clock, label: "Avg. Session", value: "3m 24s", change: "+8%", color: "bg-purple-500/20 text-purple-400" },
          { icon: TrendingUp, label: "Bounce Rate", value: "32%", change: "-3%", color: "bg-gold-400/20 text-gold-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(15,15,30,0.8)" }}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color} mb-3`}>
              <s.icon className="w-4.5 h-4.5" />
            </div>
            <p className="text-2xl font-bold text-white font-sora">{s.value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">{s.label}</p>
              <span className="text-xs text-emerald-400 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" />{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div>
          <h2 className="font-sora font-semibold text-sm text-white mb-3">Traffic Sources</h2>
          <div className="rounded-xl border border-white/10 p-5 space-y-4" style={{ background: "rgba(15,15,30,0.8)" }}>
            {trafficSources.map((t) => (
              <div key={t.source}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-300">{t.source}</span>
                  <span className="text-gray-500">{t.sessions} ({t.pct})</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${t.color} rounded-full`} style={{ width: t.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div>
          <h2 className="font-sora font-semibold text-sm text-white mb-3">Top Countries</h2>
          <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "rgba(15,15,30,0.8)" }}>
            <table className="w-full text-sm">
              <tbody>
                {topCountries.map((c) => (
                  <tr key={c.country} className="border-b border-white/5">
                    <td className="p-3 text-white">{c.country}</td>
                    <td className="p-3 text-right text-gray-400">{c.sessions}</td>
                    <td className="p-3 text-right text-gray-500 w-16">{c.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Device Breakdown */}
      <div>
        <h2 className="font-sora font-semibold text-sm text-white mb-3">Device Breakdown</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Smartphone, label: "Mobile", value: "72%", sessions: "13,271" },
            { icon: Monitor, label: "Desktop", value: "24%", sessions: "4,424" },
            { icon: Monitor, label: "Tablet", value: "4%", sessions: "737" },
          ].map(d => (
            <div key={d.label} className="rounded-xl border border-white/10 p-4 text-center" style={{ background: "rgba(15,15,30,0.8)" }}>
              <d.icon className="w-6 h-6 text-gold-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white font-sora">{d.value}</p>
              <p className="text-xs text-gray-500">{d.label} • {d.sessions}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
