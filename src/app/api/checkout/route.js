import { NextResponse } from "next/server";
import { z } from "zod";
import { computeShipping } from "@/lib/checkout";
import { getRazorpay, razorpayConfigured } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.uuid(),
        qty: z.number().int().min(1).max(20),
      }),
    )
    .min(1)
    .max(50),
  address: z.object({
    fullName: z.string().trim().min(1).max(120),
    phone: z.string().trim().min(7).max(20),
    email: z.email().max(254),
    line1: z.string().trim().min(1).max(200),
    line2: z.string().trim().max(200).optional().default(""),
    city: z.string().trim().min(1).max(100),
    state: z.string().trim().min(1).max(100),
    pincode: z.string().trim().min(4).max(10),
  }),
});

function fail(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !razorpayConfigured()) {
    return fail("Checkout is not configured yet.", 503);
  }

  // Require an authenticated user (orders are tied to an account).
  const ssr = await createClient();
  const {
    data: { user },
  } = await ssr.auth.getUser();
  if (!user) return fail("Please sign in to check out.", 401);

  let json;
  try {
    json = await request.json();
  } catch {
    return fail("Invalid request.");
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return fail("Please complete all required fields.");

  const { items, address } = parsed.data;
  const admin = createAdminClient();

  // Re-fetch authoritative prices + stock from the DB. Never trust the client.
  const variantIds = items.map((i) => i.variantId);
  const { data: variants, error: variantError } = await admin
    .from("product_variants")
    .select(
      "id, price_override, stock_qty, label, sku, product_id, products(name, base_price, status)",
    )
    .in("id", variantIds);

  if (variantError) return fail("Could not validate your cart.", 500);

  const byId = new Map((variants ?? []).map((v) => [v.id, v]));
  const lineItems = [];
  let subtotal = 0;

  for (const { variantId, qty } of items) {
    const v = byId.get(variantId);
    if (!v || v.products?.status !== "active") {
      return fail("One of the items is no longer available.");
    }
    if (qty > v.stock_qty) {
      return fail(`Not enough stock for ${v.products.name} (${v.label}).`);
    }
    const unitPrice = v.price_override ?? v.products.base_price;
    subtotal += unitPrice * qty;
    lineItems.push({
      product_id: v.product_id,
      variant_id: v.id,
      name: v.products.name,
      variant_label: v.label,
      sku: v.sku,
      unit_price: unitPrice,
      qty,
    });
  }

  const shipping = computeShipping(subtotal);
  const total = subtotal + shipping;

  // Create our order first (pending) so we have an order number for the receipt.
  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: user.id,
      email: address.email,
      subtotal,
      shipping_fee: shipping,
      total,
      currency: "INR",
      shipping_address: address,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) return fail("Could not create your order.", 500);

  const { error: itemsError } = await admin
    .from("order_items")
    .insert(lineItems.map((li) => ({ ...li, order_id: order.id })));
  if (itemsError) return fail("Could not create your order.", 500);

  // Create the Razorpay order for the server-computed total.
  let rzpOrder;
  try {
    rzpOrder = await getRazorpay().orders.create({
      amount: total,
      currency: "INR",
      receipt: order.order_number,
      notes: { order_id: order.id, user_id: user.id },
    });
  } catch {
    return fail("Could not start payment. Please try again.", 502);
  }

  await admin
    .from("orders")
    .update({ razorpay_order_id: rzpOrder.id })
    .eq("id", order.id);

  return NextResponse.json({
    orderId: order.id,
    orderNumber: order.order_number,
    razorpayOrderId: rzpOrder.id,
    amount: total,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    prefill: {
      name: address.fullName,
      email: address.email,
      contact: address.phone,
    },
  });
}
