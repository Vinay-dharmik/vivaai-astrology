"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, Search, Download, Shield, Crown, User, Mail, Calendar } from "lucide-react";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/vinayd/login");
  }, [status, router]);

  if (status === "loading" || !session) return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-gold-400">Loading...</div></div>;

  const users = [
    { name: "Priya Sharma", email: "priya.sharma@gmail.com", role: "USER", reports: 12, paid: true, joined: "2026-05-20" },
    { name: "Raj Patel", email: "raj.vedic@outlook.com", role: "USER", reports: 8, paid: true, joined: "2026-05-18" },
    { name: "Amit Kumar", email: "amit.k@yahoo.com", role: "USER", reports: 3, paid: false, joined: "2026-05-15" },
    { name: "Neha Gupta", email: "neha.gupta@gmail.com", role: "USER", reports: 15, paid: true, joined: "2026-05-12" },
    { name: "Vikram Singh", email: "vikram.s@gmail.com", role: "USER", reports: 7, paid: true, joined: "2026-05-10" },
    { name: "Pooja Mishra", email: "pooja.m@gmail.com", role: "USER", reports: 2, paid: false, joined: "2026-05-08" },
    { name: "Anita Devi", email: "anita.devi@gmail.com", role: "USER", reports: 21, paid: true, joined: "2026-05-05" },
    { name: "Suresh Yadav", email: "suresh.y@gmail.com", role: "USER", reports: 1, paid: false, joined: "2026-05-01" },
  ];

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sora font-bold text-2xl text-white">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} registered users</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-gray-300 hover:bg-white/5 transition">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total Users", value: "12,847", color: "bg-blue-500/20 text-blue-400" },
          { icon: Crown, label: "Premium Users", value: "3,415", color: "bg-gold-400/20 text-gold-400" },
          { icon: User, label: "Active Today", value: "2,103", color: "bg-emerald-500/20 text-emerald-400" },
          { icon: Mail, label: "Email Verified", value: "11,234", color: "bg-purple-500/20 text-purple-400" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(15,15,30,0.8)" }}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color} mb-3`}><s.icon className="w-4.5 h-4.5" /></div>
            <p className="text-2xl font-bold text-white font-sora">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" placeholder="Search users by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/40" />
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "rgba(15,15,30,0.8)" }}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-xs text-gray-500">
              <th className="text-left p-3 font-medium">User</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Role</th>
              <th className="text-right p-3 font-medium">Reports</th>
              <th className="text-center p-3 font-medium">Premium</th>
              <th className="text-right p-3 font-medium hidden sm:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filtered.map((u) => (
              <tr key={u.email} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                <td className="p-3">
                  <p className="text-white font-medium text-sm">{u.name}</p>
                  <p className="text-[0.65rem] text-gray-600">{u.email}</p>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-400/10 text-blue-400">{u.role}</span>
                </td>
                <td className="p-3 text-right text-gray-300">{u.reports}</td>
                <td className="p-3 text-center">
                  {u.paid ? <Crown className="w-4 h-4 text-gold-400 mx-auto" /> : <span className="text-gray-600 text-xs">Free</span>}
                </td>
                <td className="p-3 text-right text-xs text-gray-500 hidden sm:table-cell">{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
