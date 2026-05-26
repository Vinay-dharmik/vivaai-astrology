"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, FileText, Users, CreditCard, Search,
  Settings, BarChart3, Shield, Image, Sparkles, LogOut,
  Menu, X, ChevronDown, Globe, Star, BookOpen
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/vinayd", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/vinayd/blogs", icon: FileText, label: "Blog CMS" },
  { href: "/vinayd/seo", icon: Search, label: "SEO Manager" },
  { href: "/vinayd/users", icon: Users, label: "Users" },
  { href: "/vinayd/payments", icon: CreditCard, label: "Payments" },
  { href: "/vinayd/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/vinayd/pages", icon: Globe, label: "SEO Pages" },
  { href: "/vinayd/nakshatra", icon: Star, label: "Nakshatra CMS" },
  { href: "/vinayd/media", icon: Image, label: "Media Library" },
  { href: "/vinayd/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/vinayd") return pathname === "/vinayd";
    return pathname?.startsWith(href);
  };

  const sidebar = (
    <div className={`flex flex-col h-full ${collapsed ? "w-16" : "w-60"} transition-all duration-200`}>
      {/* Logo */}
      <div className="flex items-center gap-2 p-4 border-b border-white/10">
        <Sparkles className="w-6 h-6 text-gold-400 shrink-0" />
        {!collapsed && <span className="font-sora font-bold gold-text text-lg">VivaAI</span>}
        {!collapsed && <span className="text-[0.6rem] bg-gold-400/20 text-gold-400 px-1.5 py-0.5 rounded-full ml-auto">Admin</span>}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
              isActive(item.href)
                ? "bg-gold-400/15 text-gold-400 font-semibold"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className="w-4.5 h-4.5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User info */}
      {session?.user && (
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 mb-2">
            {session.user.image && (
              <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
            )}
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white font-medium truncate">{session.user.name}</p>
                <p className="text-[0.6rem] text-gray-500 truncate">{session.user.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/vinayd/login" })}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-400/10 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            {!collapsed && "Sign Out"}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 border-r border-white/10"
        style={{ background: "rgba(8,8,16,0.98)" }}>
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[#1a1a2e] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white z-50">
          <ChevronDown className={`w-3 h-3 transition ${collapsed ? "-rotate-90" : "rotate-90"}`} />
        </button>
        {sidebar}
      </aside>

      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1a1a2e] border border-white/10 text-gold-400">
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 border-r border-white/10"
            style={{ background: "rgba(8,8,16,0.99)" }}>
            <button onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main content spacer */}
      <div className={`hidden lg:block shrink-0 ${collapsed ? "w-16" : "w-60"} transition-all duration-200`} />
    </>
  );
}
