"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Lock, LogIn, Mail, Sparkles, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session) router.push("/vinayd");
  }, [session, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/vinayd",
    });

    setIsSubmitting(false);

    if (result?.ok) {
      router.push("/vinayd");
      router.refresh();
      return;
    }

    setError("Invalid email or password.");
  };

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
            Sign in with your admin email and password to access the dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <label className="block">
              <span className="text-xs font-medium text-gray-300">Email</span>
              <span className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 focus-within:border-gold-400/60">
                <Mail className="h-4 w-4 text-gold-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                  placeholder="vinaydharmik007@gmail.com"
                />
              </span>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-gray-300">Password</span>
              <span className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 focus-within:border-gold-400/60">
                <Lock className="h-4 w-4 text-gold-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                  placeholder="Enter password"
                />
              </span>
            </label>

            {error && (
              <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-400 px-4 py-3 text-sm font-semibold text-black shadow-lg transition hover:bg-gold-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogIn className="h-4 w-4" />
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-[0.6rem] text-[var(--text-muted)] mt-6">
            Access is limited to the configured admin account.
          </p>
        </div>
      </div>
    </div>
  );
}
