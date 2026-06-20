import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, isAdminEmail } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/admin/stats
 * Returns REAL payment data pulled live from the Razorpay API.
 * Session-protected — only the authorized admin may call it.
 *
 * Query: ?days=30 (optional, default 90) to limit the window.
 */
export async function GET(req: Request) {
  // ── Authorize ──────────────────────────────────────
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Razorpay not configured", configured: false }, { status: 200 });
  }

  const { searchParams } = new URL(req.url);
  const days = Math.min(Math.max(Number(searchParams.get("days")) || 90, 1), 365);
  const from = Math.floor(Date.now() / 1000) - days * 86400;

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  try {
    // Razorpay returns up to 100 per page; paginate to cover the window.
    type RzpPayment = {
      id: string; amount: number; currency: string; status: string;
      order_id: string | null; method: string; email: string | null;
      contact: string | null; created_at: number; notes?: Record<string, string>;
    };

    const all: RzpPayment[] = [];
    let skip = 0;
    for (let page = 0; page < 10; page++) {
      const url = `https://api.razorpay.com/v1/payments?count=100&skip=${skip}&from=${from}`;
      const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` }, cache: "no-store" });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        return NextResponse.json(
          { error: err?.error?.description || "Razorpay API error", status: res.status },
          { status: res.status === 401 ? 401 : 502 }
        );
      }
      const data = await res.json();
      const items: RzpPayment[] = data.items || [];
      all.push(...items);
      if (items.length < 100) break;
      skip += 100;
    }

    // ── Compute metrics ──────────────────────────────
    const captured = all.filter((p) => p.status === "captured" || p.status === "refunded");
    const failed = all.filter((p) => p.status === "failed");
    const revenuePaise = captured
      .filter((p) => p.status === "captured")
      .reduce((sum, p) => sum + p.amount, 0);

    const totalAttempts = all.length;
    const successRate = totalAttempts > 0 ? (captured.length / totalAttempts) * 100 : 0;

    // Breakdown by product (from order notes — plan: "pdf" | "matching")
    const byProduct: Record<string, { count: number; revenue: number }> = {};
    for (const p of captured.filter((x) => x.status === "captured")) {
      const plan = p.notes?.plan || p.notes?.product || "other";
      byProduct[plan] = byProduct[plan] || { count: 0, revenue: 0 };
      byProduct[plan].count++;
      byProduct[plan].revenue += p.amount / 100;
    }

    // Last 7-day revenue trend (per day)
    const dayBuckets: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
      dayBuckets[d] = 0;
    }
    for (const p of captured.filter((x) => x.status === "captured")) {
      const d = new Date(p.created_at * 1000).toISOString().split("T")[0];
      if (d in dayBuckets) dayBuckets[d] += p.amount / 100;
    }

    // Recent transactions (most recent 25)
    const recent = all
      .sort((a, b) => b.created_at - a.created_at)
      .slice(0, 25)
      .map((p) => ({
        id: p.id,
        orderId: p.order_id,
        amount: p.amount / 100,
        currency: p.currency,
        status: p.status,
        method: p.method,
        contact: p.contact,
        email: p.email,
        product: p.notes?.plan || p.notes?.product || "—",
        createdAt: p.created_at * 1000,
      }));

    return NextResponse.json({
      configured: true,
      windowDays: days,
      revenue: revenuePaise / 100,
      capturedCount: captured.filter((x) => x.status === "captured").length,
      refundedCount: captured.filter((x) => x.status === "refunded").length,
      failedCount: failed.length,
      totalAttempts,
      successRate: Math.round(successRate * 10) / 10,
      byProduct,
      dailyRevenue: Object.entries(dayBuckets).map(([date, amount]) => ({ date, amount })),
      recent,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch payment data" },
      { status: 500 }
    );
  }
}
