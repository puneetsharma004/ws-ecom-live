import "server-only";
import { createClient } from "@/lib/supabase/server";

export const PRODUCTS_PER_PAGE = 12;

// Maps the ?sort= query value to an ordered list of [column, ascending] pairs.
const SORT_OPTIONS = {
  featured: [
    ["is_featured", false],
    ["created_at", false],
  ],
  newest: [["created_at", false]],
  "price-asc": [["base_price", true]],
  "price-desc": [["base_price", false]],
};

const LIST_SELECT =
  "id, slug, name, base_price, compare_at_price, is_featured, created_at, categories(slug, name), product_images(image_url, alt, sort_order)";

const DETAIL_SELECT =
  "id, slug, name, description, base_price, compare_at_price, is_featured, created_at, categories(slug, name), product_images(id, image_url, alt, sort_order), product_variants(id, sku, label, price_override, stock_qty, attributes, sort_order)";

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name")
    .order("sort_order", { ascending: true });
  return error ? [] : (data ?? []);
}

export async function getProducts({
  categories = [],
  minPrice,
  maxPrice,
  sort = "featured",
  page = 1,
} = {}) {
  const supabase = await createClient();
  const empty = {
    products: [],
    total: 0,
    page: 1,
    perPage: PRODUCTS_PER_PAGE,
    totalPages: 0,
  };

  // Resolve category slugs -> ids.
  let categoryIds = null;
  if (categories.length) {
    const { data: cats } = await supabase
      .from("categories")
      .select("id")
      .in("slug", categories);
    categoryIds = (cats ?? []).map((c) => c.id);
    if (categoryIds.length === 0) return empty;
  }

  let query = supabase
    .from("products")
    .select(LIST_SELECT, { count: "exact" })
    .eq("status", "active");

  if (categoryIds) query = query.in("category_id", categoryIds);
  if (Number.isFinite(minPrice))
    query = query.gte("base_price", Math.round(minPrice * 100));
  if (Number.isFinite(maxPrice))
    query = query.lte("base_price", Math.round(maxPrice * 100));

  for (const [col, ascending] of SORT_OPTIONS[sort] ?? SORT_OPTIONS.featured) {
    query = query.order(col, { ascending });
  }

  const safePage = Math.max(1, page);
  const from = (safePage - 1) * PRODUCTS_PER_PAGE;
  query = query.range(from, from + PRODUCTS_PER_PAGE - 1);

  const { data, count, error } = await query;
  if (error) return { ...empty, page: safePage };

  const total = count ?? 0;
  return {
    products: (data ?? []).map(normalizeListProduct),
    total,
    page: safePage,
    perPage: PRODUCTS_PER_PAGE,
    totalPages: Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE)),
  };
}

export async function getProductBySlug(slug) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(DETAIL_SELECT)
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  if (error || !data) return null;

  const images = [...(data.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const variants = [...(data.product_variants ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    description: data.description,
    basePrice: data.base_price,
    compareAtPrice: data.compare_at_price,
    category: data.categories
      ? { slug: data.categories.slug, name: data.categories.name }
      : null,
    images: images.map((i) => ({ id: i.id, url: i.image_url, alt: i.alt })),
    variants: variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      label: v.label,
      price: v.price_override ?? data.base_price,
      stock: v.stock_qty,
      attributes: v.attributes ?? {},
    })),
  };
}

export async function getFeaturedProducts(limit = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(LIST_SELECT)
    .eq("status", "active")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return error ? [] : (data ?? []).map(normalizeListProduct);
}

export async function getRelatedProducts(categorySlug, excludeSlug, limit = 4) {
  if (!categorySlug) return [];
  const supabase = await createClient();
  const { data: cat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();
  if (!cat) return [];

  const { data } = await supabase
    .from("products")
    .select(LIST_SELECT)
    .eq("status", "active")
    .eq("category_id", cat.id)
    .neq("slug", excludeSlug)
    .limit(limit);
  return (data ?? []).map(normalizeListProduct);
}

function primaryImage(images) {
  if (!images || images.length === 0) return null;
  return [...images].sort((a, b) => a.sort_order - b.sort_order)[0];
}

function normalizeListProduct(p) {
  const img = primaryImage(p.product_images);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    basePrice: p.base_price,
    compareAtPrice: p.compare_at_price,
    isFeatured: p.is_featured,
    createdAt: p.created_at,
    category: p.categories
      ? { slug: p.categories.slug, name: p.categories.name }
      : null,
    image: img ? { url: img.image_url, alt: img.alt } : null,
  };
}
