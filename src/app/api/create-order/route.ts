import { NextRequest, NextResponse } from "next/server";

// POST /api/create-order
// Creates a Razorpay order using the Orders API
export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "INR", receipt, notes } = await req.json();

    // Validate amount (minimum 100 paise = ₹1)
    if (!amount || typeof amount !== "number" || amount < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum is 100 paise (₹1)." },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay credentials missing — RAZORPAY_KEY_ID:", !!keyId, "RAZORPAY_KEY_SECRET:", !!keySecret);
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

    // Create order via Razorpay API (direct HTTP — no SDK needed)
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const body = {
      amount,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    };

    console.log("[Razorpay] Creating order:", { amount, currency, keyId: keyId.substring(0, 12) + "..." });

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

      if (orderResponse.status === 401) {
        return NextResponse.json(
          { error: "Payment authentication failed. Check Razorpay credentials." },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: responseData?.error?.description || "Failed to create payment order" },
        { status: 500 }
      );
    }

    console.log("[Razorpay] Order created:", responseData.id);

    return NextResponse.json({
      order_id: responseData.id,
      amount: responseData.amount,
      currency: responseData.currency,
    });
  } catch (error: any) {
    console.error("[Razorpay] Create order error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
