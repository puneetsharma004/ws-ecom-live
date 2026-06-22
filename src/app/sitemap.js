import { createPublicClient } from "@/lib/supabase/public";

const STATIC_PATHS = [
  "",
  "/shop",
  "/courses",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/shipping",
  "/returns",
];

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const routes = STATIC_PATHS.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }));

  // Add active product pages (best-effort; never fail the sitemap).
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("status", "active");
    for (const p of data ?? []) {
      routes.push({
        url: `${base}/products/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      });
    }
  } catch {
    // Supabase unreachable at build — ship the static routes only.
  }

  return routes;
}
