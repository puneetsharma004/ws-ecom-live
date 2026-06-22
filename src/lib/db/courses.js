import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

// Public, cacheable read.
export async function getPublishedCourses() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("courses")
    .select("id, slug, title, blurb, image_url, external_url, price_label")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

// Admin reads (sees unpublished too, via RLS).
export async function getAdminCourses() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("id, slug, title, is_published, price_label, sort_order")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getCourseById(id) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select(
      "id, slug, title, blurb, image_url, external_url, price_label, is_published, sort_order",
    )
    .eq("id", id)
    .maybeSingle();
  return data ?? null;
}
