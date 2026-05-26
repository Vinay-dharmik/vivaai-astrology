"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Users, CreditCard, FileText, Globe, TrendingUp, Eye,
  BarChart3, Sparkles, ArrowUpRight, ArrowDownRight, Activity,
  DollarSign, Star, BookOpen
} from "lucide-react";
import Link from "next/link";

// ── Stat Card ───────────────────────────────────────
function StatCard({ icon: Icon, label, value, change, changeType, color }: {
  icon: any; label: string; value: string; change: string; changeType: "up" | "down"; color: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(15,15,30,0.8)" }}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium ${changeType === "up" ? "text-emerald-400" : "text-red-400"}`}>
          {changeType === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-white font-sora">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

// ── Quick Action Card ───────────────────────────────
function QuickAction({ icon: Icon, label, href, color }: { icon: any; label: string; href: string; color: string }) {
  return (
    <Link href={href} className={`flex items-center gap-3 p-4 rounded-xl border border-white/10 hover:border-white/20 transition group`}
      style={{ background: "rgba(15,15,30,0.8)" }}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm text-gray-300 group-hover:text-white transition">{label}</span>
    </Link>
  );
}

// ── Recent Activity Item ────────────────────────────
function ActivityItem({ icon: Icon, text, time, color }: { icon: any; text: string; time: string; color: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-300">{text}</p>
        <p className="text-[0.6rem] text-gray-600 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/vinayd/login");
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-gold-400">Loading dashboard...</div></div>;
  }

  if (!session) return null;

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sora font-bold text-2xl text-white">{greeting}, {session.user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Here&apos;s what&apos;s happening with VivaAI today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>System healthy</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value="12,847" change="+12.5%" changeType="up" color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={DollarSign} label="Revenue (₹)" value="₹1,24,500" change="+8.2%" changeType="up" color="bg-emerald-500/20 text-emerald-400" />
        <StatCard icon={FileText} label="Reports Generated" value="34,291" change="+15.3%" changeType="up" color="bg-purple-500/20 text-purple-400" />
        <StatCard icon={Globe} label="Indexed Pages" value="968" change="+40" changeType="up" color="bg-gold-400/20 text-gold-400" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Page Views (Today)" value="8,432" change="+23%" changeType="up" color="bg-cyan-500/20 text-cyan-400" />
        <StatCard icon={BookOpen} label="Blog Posts" value="52" change="+40" changeType="up" color="bg-orange-500/20 text-orange-400" />
        <StatCard icon={Star} label="Kundalis Today" value="1,247" change="+5.1%" changeType="up" color="bg-yellow-500/20 text-yellow-400" />
        <StatCard icon={TrendingUp} label="Conversion Rate" value="4.2%" change="+0.3%" changeType="up" color="bg-pink-500/20 text-pink-400" />
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h2 className="font-sora font-semibold text-sm text-white mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <QuickAction icon={FileText} label="Create Blog Post" href="/vinayd/blogs/new" color="bg-blue-500/20 text-blue-400" />
            <QuickAction icon={Globe} label="Generate SEO Pages" href="/vinayd/pages" color="bg-emerald-500/20 text-emerald-400" />
            <QuickAction icon={Star} label="Manage Nakshatras" href="/vinayd/nakshatra" color="bg-gold-400/20 text-gold-400" />
            <QuickAction icon={BarChart3} label="View Analytics" href="/vinayd/analytics" color="bg-purple-500/20 text-purple-400" />
            <QuickAction icon={CreditCard} label="Payment Logs" href="/vinayd/payments" color="bg-pink-500/20 text-pink-400" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <h2 className="font-sora font-semibold text-sm text-white mb-3">Recent Activity</h2>
          <div className="rounded-xl border border-white/10 p-4" style={{ background: "rgba(15,15,30,0.8)" }}>
            <ActivityItem icon={CreditCard} text="Payment received — ₹19 Kundali PDF" time="2 minutes ago" color="bg-emerald-500/20 text-emerald-400" />
            <ActivityItem icon={Users} text="New user registered via Google — priya.sharma@gmail.com" time="8 minutes ago" color="bg-blue-500/20 text-blue-400" />
            <ActivityItem icon={FileText} text="Blog post published — 'Saturn Transit 2026 Effects'" time="1 hour ago" color="bg-purple-500/20 text-purple-400" />
            <ActivityItem icon={Star} text="Kundali report generated — Ashwini Nakshatra, Aries Lagna" time="1 hour ago" color="bg-gold-400/20 text-gold-400" />
            <ActivityItem icon={CreditCard} text="Payment received — ₹19 Kundali PDF" time="3 hours ago" color="bg-emerald-500/20 text-emerald-400" />
            <ActivityItem icon={Globe} text="Google indexed 40 new Nakshatra compatibility pages" time="6 hours ago" color="bg-cyan-500/20 text-cyan-400" />
            <ActivityItem icon={Users} text="New user registered — raj.vedic@outlook.com" time="8 hours ago" color="bg-blue-500/20 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div>
        <h2 className="font-sora font-semibold text-sm text-white mb-3">Top Pages (Last 7 Days)</h2>
        <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "rgba(15,15,30,0.8)" }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-xs text-gray-500">
                <th className="text-left p-3 font-medium">Page</th>
                <th className="text-right p-3 font-medium">Views</th>
                <th className="text-right p-3 font-medium hidden sm:table-cell">Unique</th>
                <th className="text-right p-3 font-medium hidden sm:table-cell">Avg Time</th>
                <th className="text-right p-3 font-medium">Bounce</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { page: "/kundali", views: "4,231", unique: "3,891", time: "3m 42s", bounce: "28%" },
                { page: "/horoscope/aries", views: "2,847", unique: "2,412", time: "2m 15s", bounce: "35%" },
                { page: "/matching", views: "2,103", unique: "1,867", time: "4m 08s", bounce: "22%" },
                { page: "/nakshatra-compatibility", views: "1,892", unique: "1,654", time: "2m 33s", bounce: "31%" },
                { page: "/blog/manglik-dosha-complete-guide", views: "1,234", unique: "1,102", time: "5m 12s", bounce: "19%" },
                { page: "/calculator/numerology", views: "987", unique: "876", time: "1m 55s", bounce: "42%" },
              ].map((row) => (
                <tr key={row.page} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                  <td className="p-3 text-blue-400 font-mono text-xs">{row.page}</td>
                  <td className="p-3 text-right text-white">{row.views}</td>
                  <td className="p-3 text-right text-gray-400 hidden sm:table-cell">{row.unique}</td>
                  <td className="p-3 text-right text-gray-400 hidden sm:table-cell">{row.time}</td>
                  <td className="p-3 text-right text-gray-400">{row.bounce}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
