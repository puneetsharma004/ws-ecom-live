import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { safeEqual } from "@/lib/signature";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// Razorpay webhook — the authoritative source of truth for payment status.
// Verifies the signature over the RAW body, then marks the order paid
// idempotently (also covers customers who close the tab before /verify runs).
export async function POST(request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return new NextResponse("Webhook not configured", { status: 503 });
  }

  const signature = request.headers.get("x-razorpay-signature");
  const raw = await request.text();
  const expected = crypto
    .createHmac("sha256", secret)
    .update(raw)
    .digest("hex");
  if (!signature || !safeEqual(expected, signature)) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return new NextResponse("Bad payload", { status: 400 });
  }

  if (event.event === "payment.captured" || event.event === "order.paid") {
    const payment = event.payload?.payment?.entity;
    const rzpOrderId =
      payment?.order_id ?? event.payload?.order?.entity?.id ?? null;
    const paymentId = payment?.id ?? null;

    if (rzpOrderId) {
      const admin = createAdminClient();
      const { data: order } = await admin
        .from("orders")
        .select("id")
        .eq("razorpay_order_id", rzpOrderId)
        .maybeSingle();

      if (order) {
        await admin.rpc("mark_order_paid", {
          p_order_id: order.id,
          p_payment_id: paymentId,
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
