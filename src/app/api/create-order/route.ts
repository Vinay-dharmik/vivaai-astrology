import { NextRequest, NextResponse } from "next/server";

/**
 * VALID PRICING TIERS — server-side validation prevents price tampering.
 * Amount is in paise (₹19 = 1900 paise).
 */
const VALID_AMOUNTS: Record<string, number> = {
  pdf: 1900,           // ₹19 — PDF download
  matching: 1900,      // ₹19 — matching report PDF
};

// Simple in-memory rate limiter (per IP, resets every minute)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // max 10 orders per minute per IP
const RATE_WINDOW = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// POST /api/create-order
// Creates a Razorpay order — validates amount server-side
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { plan, currency = "INR", notes } = await req.json();

    // Validate plan exists and get server-enforced amount
    if (!plan || !VALID_AMOUNTS[plan]) {
      return NextResponse.json(
        { error: "Invalid plan. Choose: starter, popular, ultimate, or matching." },
        { status: 400 }
      );
    }

    const amount = VALID_AMOUNTS[plan];

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("[Razorpay] Credentials missing");
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

    // Create order via Razorpay API
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const body = {
      amount,
      currency,
      receipt: `rcpt_${plan}_${Date.now()}`,
      notes: { plan, ...(notes || {}) },
    };

    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(body),
    });

    const responseData = await orderResponse.json().catch(() => null);

    if (!orderResponse.ok) {
      console.error("[Razorpay] Order creation failed:", orderResponse.status, responseData);
      return NextResponse.json(
        { error: responseData?.error?.description || "Failed to create payment order" },
        { status: orderResponse.status === 401 ? 401 : 500 }
      );
    }

    return NextResponse.json({
      order_id: responseData.id,
      amount: responseData.amount,
      currency: responseData.currency,
      plan,
    });
  } catch (error: any) {
    console.error("[Razorpay] Create order error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
