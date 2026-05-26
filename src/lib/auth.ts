/**
 * VivaAI Admin — Auth Configuration
 * Handles Google OAuth + session management for admin panel
 */

import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Admin email whitelist — only these emails can access /vinayd
const ADMIN_EMAILS = [
  "vinaydharmik@gmail.com",  // Add your email
  // Add more admin emails as needed
];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow whitelisted admin emails
      return ADMIN_EMAILS.includes(user.email || "");
    },
    async session({ session }) {
      // Attach admin role to session
      if (session.user?.email && ADMIN_EMAILS.includes(session.user.email)) {
        (session.user as any).role = "SUPER_ADMIN";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.email && ADMIN_EMAILS.includes(user.email)) {
        token.role = "SUPER_ADMIN";
      }
      return token;
    },
  },
  pages: {
    signIn: "/vinayd/login",
    error: "/vinayd/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
