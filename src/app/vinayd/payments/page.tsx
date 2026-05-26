"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CreditCard, DollarSign, TrendingUp, AlertTriangle, ArrowUpRight, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AdminPaymentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/vinayd/login");
  }, [status, router]);

  if (status === "loading" || !session) return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-gold-400">Loading...</div></div>;

  const payments = [
    { id: "pay_Ox8K2...", orderId: "order_Ox8Jn...", amount: 1900, product: "Kundali PDF", status: "success", email: "priya@gmail.com", time: "2 min ago" },
    { id: "pay_Ox7Y1...", orderId: "order_Ox7X9...", amount: 1900, product: "Kundali PDF", status: "success", email: "raj@outlook.com", time: "15 min ago" },
    { id: "pay_Ox6T3...", orderId: "order_Ox6S1...", amount: 1900, product: "Kundali PDF", status: "failed", email: "amit@yahoo.com", time: "1 hour ago" },
    { id: "pay_Ox5Q7...", orderId: "order_Ox5P4...", amount: 1900, product: "Matching PDF", status: "success", email: "neha@gmail.com", time: "3 hours ago" },
    { id: "pay_Ox4M2...", orderId: "order_Ox4L8...", amount: 1900, product: "Kundali PDF", status: "success", email: "vikram@gmail.com", time: "5 hours ago" },
    { id: "pay_Ox3H9...", orderId: "order_Ox3G5...", amount: 1900, product: "Matching PDF", status: "success", email: "pooja@gmail.com", time: "8 hours ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sora font-bold text-2xl text-white">Payment Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Revenue tracking and payment management.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "Total Revenue", value: "₹1,24,500", change: "+18%", color: "bg-emerald-500/20 text-emerald-400" },
          { icon: CheckCircle, label: "Successful", value: "2,847", change: "+12%", color: "bg-blue-500/20 text-blue-400" },
          { icon: XCircle, label: "Failed", value: "143", change: "-5%", color: "bg-red-500/20 text-red-400" },
          { icon: TrendingUp, label: "Conversion", value: "4.2%", change: "+0.3%", color: "bg-purple-500/20 text-purple-400" },
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

      {/* Pricing Tiers */}
      <div>
        <h2 className="font-sora font-semibold text-sm text-white mb-3">Active Pricing Tiers</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { name: "Free", price: "₹0", sales: "8,432", pct: "85%" },
            { name: "Kundali PDF", price: "₹19", sales: "1,247", pct: "10%" },
            { name: "Matching PDF", price: "₹19", sales: "566", pct: "5%" },
          ].map(t => (
            <div key={t.name} className="rounded-xl border border-white/10 p-4 text-center" style={{ background: "rgba(15,15,30,0.8)" }}>
              <p className="text-xs text-gray-500">{t.name}</p>
              <p className="text-lg font-bold gold-text font-sora">{t.price}</p>
              <p className="text-xs text-gray-400 mt-1">{t.sales} sales ({t.pct})</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payments */}
      <div>
        <h2 className="font-sora font-semibold text-sm text-white mb-3">Recent Payments</h2>
        <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "rgba(15,15,30,0.8)" }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-xs text-gray-500">
                <th className="text-left p-3 font-medium">Payment ID</th>
                <th className="text-left p-3 font-medium hidden sm:table-cell">Email</th>
                <th className="text-left p-3 font-medium">Product</th>
                <th className="text-right p-3 font-medium">Amount</th>
                <th className="text-center p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium hidden md:table-cell">Time</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                  <td className="p-3 font-mono text-xs text-gray-400">{p.id}</td>
                  <td className="p-3 text-xs text-gray-400 hidden sm:table-cell">{p.email}</td>
                  <td className="p-3 text-xs text-white">{p.product}</td>
                  <td className="p-3 text-right text-white font-medium">₹{(p.amount / 100).toFixed(0)}</td>
                  <td className="p-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      p.status === "success" ? "bg-emerald-400/10 text-emerald-400" :
                      p.status === "failed" ? "bg-red-400/10 text-red-400" :
                      "bg-yellow-400/10 text-yellow-400"
                    }`}>{p.status}</span>
                  </td>
                  <td className="p-3 text-right text-xs text-gray-500 hidden md:table-cell">{p.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
