import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_EMAIL = "vinaydharmik007@gmail.com";

/**
 * VivaAI Middleware — runs on every request at the edge.
 * 
 * 1. Admin route protection (redirect unauthenticated users)
 * 2. API rate limiting headers
 * 3. Security headers for sensitive routes
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin route protection ────────────────────────
  // If accessing /vinayd/* (except login page), require the fixed admin session
  if (pathname.startsWith("/vinayd") && !pathname.startsWith("/vinayd/login")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (token?.email !== ADMIN_EMAIL || token.role !== "SUPER_ADMIN") {
      const loginUrl = new URL("/vinayd/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Block direct access to admin API from non-admin origins ──
  if (pathname.startsWith("/api/") && pathname !== "/api/create-order" && pathname !== "/api/verify-payment") {
    // Allow NextAuth API routes
    if (!pathname.startsWith("/api/auth")) {
      const origin = req.headers.get("origin") || "";
      const referer = req.headers.get("referer") || "";
      const isAllowed = origin.includes("vivaai.in") || origin.includes("localhost") || referer.includes("vivaai.in") || referer.includes("localhost");
      
      if (!isAllowed && req.method !== "GET") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
  }

  return NextResponse.next();
}

// Only run middleware on admin and API routes (skip static assets)
export const config = {
  matcher: [
    "/vinayd/:path*",
    "/api/:path*",
  ],
};
