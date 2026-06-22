"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// ---- guards / helpers -------------------------------------------------------

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/");
  return supabase;
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Rupees string -> integer paise (or null for empty).
function toPaise(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

function refreshProduct(id, slug) {
  revalidatePath("/admin/inventory");
  if (id) revalidatePath(`/admin/inventory/${id}`);
  revalidatePath("/shop");
  if (slug) revalidatePath(`/products/${slug}`);
}

// ---- products ---------------------------------------------------------------

const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(160),
  slug: z.string().trim().max(160).optional(),
  description: z.string().trim().max(4000).optional(),
  category_id: z.uuid("Pick a category."),
  status: z.enum(["draft", "active", "archived"]),
});

export async function createProduct(_prev, formData) {
  const supabase = await requireAdmin();
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    category_id: formData.get("category_id"),
    status: formData.get("status") || "draft",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const basePrice = toPaise(formData.get("base_price"));
  if (basePrice == null) return { error: "Enter a valid price." };

  const slug = parsed.data.slug
    ? slugify(parsed.data.slug)
    : slugify(parsed.data.name);

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: parsed.data.name,
      slug,
      description: parsed.data.description || null,
      category_id: parsed.data.category_id,
      status: parsed.data.status,
      base_price: basePrice,
      compare_at_price: toPaise(formData.get("compare_at_price")),
      is_featured: formData.get("is_featured") === "on",
    })
    .select("id")
    .single();

  if (error) {
    return {
      error:
        error.code === "23505" ? "That slug is already taken." : error.message,
    };
  }

  revalidatePath("/admin/inventory");
  redirect(`/admin/inventory/${data.id}`);
}

export async function updateProduct(_prev, formData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id"));
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    category_id: formData.get("category_id"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const basePrice = toPaise(formData.get("base_price"));
  if (basePrice == null) return { error: "Enter a valid price." };

  const slug = parsed.data.slug
    ? slugify(parsed.data.slug)
    : slugify(parsed.data.name);

  const { error } = await supabase
    .from("products")
    .update({
      name: parsed.data.name,
      slug,
      description: parsed.data.description || null,
      category_id: parsed.data.category_id,
      status: parsed.data.status,
      base_price: basePrice,
      compare_at_price: toPaise(formData.get("compare_at_price")),
      is_featured: formData.get("is_featured") === "on",
    })
    .eq("id", id);

  if (error) {
    return {
      error:
        error.code === "23505" ? "That slug is already taken." : error.message,
    };
  }

  refreshProduct(id, slug);
  return { ok: true, message: "Saved." };
}

export async function deleteProduct(formData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id"));
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/inventory");
  redirect("/admin/inventory");
}

// ---- variants ---------------------------------------------------------------

export async function addVariant(_prev, formData) {
  const supabase = await requireAdmin();
  const productId = String(formData.get("product_id"));
  const label = String(formData.get("label") || "").trim();
  if (!label) return { error: "Variant label is required." };
  const stock = Number.parseInt(formData.get("stock_qty"), 10);

  const { error } = await supabase.from("product_variants").insert({
    product_id: productId,
    label,
    sku: String(formData.get("sku") || "").trim() || null,
    price_override: toPaise(formData.get("price_override")),
    stock_qty: Number.isFinite(stock) && stock >= 0 ? stock : 0,
    sort_order: Number.parseInt(formData.get("sort_order"), 10) || 0,
  });

  if (error) {
    return {
      error:
        error.code === "23505" ? "That SKU already exists." : error.message,
    };
  }
  revalidatePath(`/admin/inventory/${productId}`);
  return { ok: true };
}

export async function updateVariant(formData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id"));
  const productId = String(formData.get("product_id"));
  const stock = Number.parseInt(formData.get("stock_qty"), 10);

  await supabase
    .from("product_variants")
    .update({
      label: String(formData.get("label") || "").trim(),
      price_override: toPaise(formData.get("price_override")),
      stock_qty: Number.isFinite(stock) && stock >= 0 ? stock : 0,
    })
    .eq("id", id);

  revalidatePath(`/admin/inventory/${productId}`);
}

export async function deleteVariant(formData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id"));
  const productId = String(formData.get("product_id"));
  await supabase.from("product_variants").delete().eq("id", id);
  revalidatePath(`/admin/inventory/${productId}`);
}

// ---- images -----------------------------------------------------------------

export async function uploadImage(_prev, formData) {
  const supabase = await requireAdmin();
  const productId = String(formData.get("product_id"));
  const file = formData.get("file");

  if (!file || typeof file === "string" || file.size === 0) {
    return { error: "Choose an image file." };
  }
  if (file.size > 5_000_000) return { error: "Image must be under 5 MB." };

  const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
  const path = `${productId}/${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error: upErr } = await supabase.storage
    .from("product-images")
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (upErr) return { error: upErr.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(path);

  const { error } = await supabase.from("product_images").insert({
    product_id: productId,
    image_url: publicUrl,
    alt: String(formData.get("alt") || "").trim() || null,
    sort_order: Number.parseInt(formData.get("sort_order"), 10) || 0,
  });
  if (error) return { error: error.message };

  revalidatePath(`/admin/inventory/${productId}`);
  return { ok: true };
}

export async function deleteImage(formData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id"));
  const productId = String(formData.get("product_id"));
  await supabase.from("product_images").delete().eq("id", id);
  revalidatePath(`/admin/inventory/${productId}`);
}

// ---- orders -----------------------------------------------------------------

const ORDER_STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export async function updateOrderStatus(formData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!ORDER_STATUSES.includes(status)) return;
  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

// ---- courses ----------------------------------------------------------------

const courseSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(160),
  slug: z.string().trim().max(160).optional(),
  external_url: z.url("Enter a valid link (https://…)."),
  blurb: z.string().trim().max(2000).optional(),
  image_url: z.string().trim().max(1000).optional(),
  price_label: z.string().trim().max(40).optional(),
});

function courseFields(formData) {
  const parsed = courseSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    external_url: formData.get("external_url"),
    blurb: formData.get("blurb"),
    image_url: formData.get("image_url"),
    price_label: formData.get("price_label"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;
  return {
    values: {
      title: d.title,
      slug: d.slug ? slugify(d.slug) : slugify(d.title),
      external_url: d.external_url,
      blurb: d.blurb || null,
      image_url: d.image_url || null,
      price_label: d.price_label || null,
      is_published: formData.get("is_published") === "on",
      sort_order: Number.parseInt(formData.get("sort_order"), 10) || 0,
    },
  };
}

export async function createCourse(_prev, formData) {
  const supabase = await requireAdmin();
  const { values, error } = courseFields(formData);
  if (error) return { error };

  const { data, error: dbError } = await supabase
    .from("courses")
    .insert(values)
    .select("id")
    .single();
  if (dbError) {
    return {
      error: dbError.code === "23505" ? "That slug is taken." : dbError.message,
    };
  }
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  redirect(`/admin/courses/${data.id}`);
}

export async function updateCourse(_prev, formData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id"));
  const { values, error } = courseFields(formData);
  if (error) return { error };

  const { error: dbError } = await supabase
    .from("courses")
    .update(values)
    .eq("id", id);
  if (dbError) {
    return {
      error: dbError.code === "23505" ? "That slug is taken." : dbError.message,
    };
  }
  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${id}`);
  revalidatePath("/courses");
  return { ok: true, message: "Saved." };
}

export async function deleteCourse(formData) {
  const supabase = await requireAdmin();
  await supabase
    .from("courses")
    .delete()
    .eq("id", String(formData.get("id")));
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  redirect("/admin/courses");
}
