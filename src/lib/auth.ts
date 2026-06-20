/**
 * VivaAI Admin — Auth Configuration
 * Handles fixed admin credentials + session management for admin panel
 */

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Credentials read from env first; fall back to defaults so existing login keeps working.
// Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local / Vercel to override (recommended).
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "vinaydharmik007@gmail.com").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Vinay@007";

/** Returns true if the given email is the authorized admin. Used by admin API routes. */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          return {
            id: "vinayd-admin",
            name: "Vinay Dharmik",
            email: ADMIN_EMAIL,
            role: "SUPER_ADMIN",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Attach admin role to session
      if (session.user && token.email === ADMIN_EMAIL) {
        session.user.name = token.name;
        session.user.email = token.email;
        (session.user as any).role = "SUPER_ADMIN";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.email === ADMIN_EMAIL) {
        token.name = user.name;
        token.email = user.email;
        token.role = "SUPER_ADMIN";
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/vinayd/login",
    error: "/vinayd/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
