import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// POST /api/verify-payment
// Verifies Razorpay payment signature using HMAC-SHA256
export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment fields" },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      console.error("RAZORPAY_KEY_SECRET not configured");
      return NextResponse.json(
        { error: "Payment verification not configured" },
        { status: 500 }
      );
    }

    // Generate expected signature: HMAC-SHA256(order_id|payment_id, secret)
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    // Compare signatures (timing-safe comparison)
    const isValid =
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature)
      );

    if (!isValid) {
      console.warn("Payment signature mismatch:", {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      });
      return NextResponse.json(
        { error: "Payment verification failed — signature mismatch" },
        { status: 400 }
      );
    }

    // Signature verified — payment is genuine
    // In a production app with a database, you would:
    // 1. Mark the order as paid in your database
    // 2. Log the transaction
    // 3. Grant access to the purchased content

    return NextResponse.json({
      verified: true,
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
