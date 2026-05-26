"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Globe, Plus, RefreshCw } from "lucide-react";

export default function AdminPagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => { if (status === "unauthenticated") router.push("/vinayd/login"); }, [status, router]);
  if (status === "loading" || !session) return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-gold-400">Loading...</div></div>;

  const pageGroups = [
    { type: "Nakshatra Compatibility", count: 729, status: "Active", auto: true },
    { type: "Planet in House", count: 108, status: "Active", auto: true },
    { type: "Zodiac Horoscope", count: 12, status: "Active", auto: true },
    { type: "Zodiac Compatibility", count: 12, status: "Active", auto: true },
    { type: "Nakshatra Detail", count: 27, status: "Active", auto: true },
    { type: "Blog Posts", count: 52, status: "Active", auto: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sora font-bold text-2xl text-white">Programmatic SEO Pages</h1>
          <p className="text-sm text-gray-500 mt-1">940+ pages generated automatically for search engine coverage.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gold-400 text-black hover:bg-gold-500 transition">
          <RefreshCw className="w-4 h-4" /> Regenerate All
        </button>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "rgba(15,15,30,0.8)" }}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-xs text-gray-500">
              <th className="text-left p-4 font-medium">Page Type</th>
              <th className="text-right p-4 font-medium">Count</th>
              <th className="text-center p-4 font-medium">Status</th>
              <th className="text-center p-4 font-medium">Auto-Generated</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {pageGroups.map(g => (
              <tr key={g.type} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                <td className="p-4 text-white font-medium">{g.type}</td>
                <td className="p-4 text-right text-gold-400 font-bold font-sora">{g.count}</td>
                <td className="p-4 text-center"><span className="text-xs px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-400">{g.status}</span></td>
                <td className="p-4 text-center text-gray-400">{g.auto ? "✓ Auto" : "Manual"}</td>
              </tr>
            ))}
            <tr className="bg-white/[0.02]">
              <td className="p-4 text-white font-bold">Total</td>
              <td className="p-4 text-right text-gold-400 font-bold font-sora">{pageGroups.reduce((s, g) => s + g.count, 0)}</td>
              <td colSpan={2}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
