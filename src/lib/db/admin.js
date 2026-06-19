import "server-only";
import { createClient } from "@/lib/supabase/server";

// All reads here run as the logged-in admin; RLS (is_admin) grants full visibility.
const PAID_STATUSES = ["paid", "processing", "shipped", "delivered"];
export const LOW_STOCK_THRESHOLD = 10;

export async function getDashboardStats() {
  const supabase = await createClient();
  const [paid, orders, products, lowStock] = await Promise.all([
    supabase.from("orders").select("total").in("status", PAID_STATUSES),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("product_variants")
      .select("id", { count: "exact", head: true })
      .lte("stock_qty", LOW_STOCK_THRESHOLD),
  ]);

  const revenue = (paid.data ?? []).reduce((s, o) => s + o.total, 0);
  return {
    revenue,
    orders: orders.count ?? 0,
    products: products.count ?? 0,
    lowStock: lowStock.count ?? 0,
  };
}

export async function getRecentOrders(limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("id, order_number, email, total, status, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getLowStockVariants(limit = 6) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_variants")
    .select("id, label, sku, stock_qty, products(name)")
    .lte("stock_qty", LOW_STOCK_THRESHOLD)
    .order("stock_qty", { ascending: true })
    .limit(limit);
  return (data ?? []).map((v) => ({
    id: v.id,
    name: v.products?.name ?? "—",
    label: v.label,
    sku: v.sku,
    stock: v.stock_qty,
  }));
}

export async function getAdminProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, slug, name, status, base_price, is_featured, categories(name), product_variants(stock_qty), product_images(image_url, sort_order)",
    )
    .order("created_at", { ascending: false });

  return (data ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    status: p.status,
    basePrice: p.base_price,
    isFeatured: p.is_featured,
    category: p.categories?.name ?? "—",
    stock: (p.product_variants ?? []).reduce((s, v) => s + v.stock_qty, 0),
    image:
      [...(p.product_images ?? [])].sort(
        (a, b) => a.sort_order - b.sort_order,
      )[0]?.image_url ?? null,
  }));
}

export async function getAdminProductById(id) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, slug, name, description, status, base_price, compare_at_price, is_featured, category_id, product_variants(id, sku, label, price_override, stock_qty, sort_order), product_images(id, image_url, alt, sort_order)",
    )
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;

  data.product_variants = [...(data.product_variants ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  data.product_images = [...(data.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  return data;
}

export async function getAdminOrders() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("id, order_number, email, total, status, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}
