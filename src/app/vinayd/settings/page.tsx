"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Settings, Database, Key, Globe, Bell, Shield, CreditCard } from "lucide-react";

function SettingCard({ icon: Icon, title, description, action, color }: { icon: any; title: string; description: string; action: string; color: string }) {
  return (
    <div className="rounded-xl border border-white/10 p-5 flex items-start gap-4" style={{ background: "rgba(15,15,30,0.8)" }}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <button className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition shrink-0">
        {action}
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => { if (status === "unauthenticated") router.push("/vinayd/login"); }, [status, router]);
  if (status === "loading" || !session) return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-gold-400">Loading...</div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sora font-bold text-2xl text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your VivaAI platform settings.</p>
      </div>
      <div className="space-y-3">
        <SettingCard icon={Globe} title="Site Settings" description="Site name, URL, description, and global SEO settings" action="Configure" color="bg-blue-500/20 text-blue-400" />
        <SettingCard icon={Database} title="Database" description="PostgreSQL connection, Prisma migrations, and data management" action="Configure" color="bg-emerald-500/20 text-emerald-400" />
        <SettingCard icon={Key} title="API Keys" description="Razorpay, Google OAuth, Analytics, and AdSense credentials" action="Manage" color="bg-gold-400/20 text-gold-400" />
        <SettingCard icon={CreditCard} title="Pricing Plans" description="Manage free, starter, premium, and detailed report pricing" action="Edit" color="bg-purple-500/20 text-purple-400" />
        <SettingCard icon={Bell} title="Notifications" description="Email alerts, webhook notifications, and admin notifications" action="Configure" color="bg-orange-500/20 text-orange-400" />
        <SettingCard icon={Shield} title="Security" description="Rate limiting, CORS, CSP headers, and admin access controls" action="Configure" color="bg-red-500/20 text-red-400" />
      </div>

      {/* Environment Status */}
      <div>
        <h2 className="font-sora font-semibold text-sm text-white mb-3">Environment Status</h2>
        <div className="rounded-xl border border-white/10 p-5 space-y-3" style={{ background: "rgba(15,15,30,0.8)" }}>
          {[
            { key: "RAZORPAY_KEY_ID", set: true },
            { key: "RAZORPAY_KEY_SECRET", set: true },
            { key: "NEXT_PUBLIC_GA_ID", set: true },
            { key: "NEXT_PUBLIC_ADSENSE_ID", set: true },
            { key: "GOOGLE_CLIENT_ID", set: false },
            { key: "GOOGLE_CLIENT_SECRET", set: false },
            { key: "DATABASE_URL", set: false },
            { key: "NEXTAUTH_SECRET", set: false },
          ].map(e => (
            <div key={e.key} className="flex items-center justify-between">
              <code className="text-xs text-gray-400 font-mono">{e.key}</code>
              <span className={`text-xs px-2 py-0.5 rounded-full ${e.set ? "bg-emerald-400/10 text-emerald-400" : "bg-yellow-400/10 text-yellow-400"}`}>
                {e.set ? "✓ Set" : "⚠ Missing"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
