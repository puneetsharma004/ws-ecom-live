import "server-only";
import { createClient } from "@/lib/supabase/server";

// Reads use the cookie-based (RLS-enforced) client, so a user only ever sees
// their own orders.
export async function getOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, status, total, currency, created_at")
    .order("created_at", { ascending: false });
  return error ? [] : (data ?? []);
}

export async function getOrderById(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, email, status, subtotal, shipping_fee, total, currency, shipping_address, razorpay_payment_id, created_at, order_items(id, name, variant_label, unit_price, qty)",
    )
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}
