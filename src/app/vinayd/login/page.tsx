"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles, Shield, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/vinayd");
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center cosmic-bg">
        <div className="animate-pulse text-gold-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center cosmic-bg p-4">
      <div className="w-full max-w-sm">
        <div className="glass-card-bright p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-gold-400" />
            <span className="font-sora font-bold text-2xl gold-text">VivaAI</span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-gold-400" />
            <h1 className="font-sora font-bold text-lg text-white">Admin Panel</h1>
          </div>
          <p className="text-xs text-[var(--text-muted)] mb-8">
            Sign in with your authorized Google account to access the admin dashboard.
          </p>

          <button
            onClick={() => signIn("google", { callbackUrl: "/vinayd" })}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-semibold text-sm transition bg-white text-gray-800 hover:bg-gray-100 shadow-lg"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <p className="text-[0.6rem] text-[var(--text-muted)] mt-6">
            Only authorized admin emails can access this panel.
          </p>
        </div>
      </div>
    </div>
  );
}
