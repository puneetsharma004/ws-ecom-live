// Shared (pure) helpers for the shop's URL query params. Used by the server
// page to parse and by client controls to build navigation links.

export function parseShopParams(sp) {
  const cat = sp?.category;
  const categories = Array.isArray(cat) ? cat : cat ? [cat] : [];
  const minPrice =
    sp?.min != null && sp.min !== "" ? Number(sp.min) : undefined;
  const maxPrice =
    sp?.max != null && sp.max !== "" ? Number(sp.max) : undefined;
  const sort = typeof sp?.sort === "string" ? sp.sort : "featured";
  const page = sp?.page ? Math.max(1, Number.parseInt(sp.page, 10) || 1) : 1;
  return {
    categories,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    sort,
    page,
  };
}

export function buildShopQuery(current, overrides = {}) {
  const merged = { ...current, ...overrides };
  const params = new URLSearchParams();

  for (const slug of merged.categories ?? []) params.append("category", slug);
  if (merged.minPrice != null && merged.minPrice !== "")
    params.set("min", String(merged.minPrice));
  if (merged.maxPrice != null && merged.maxPrice !== "")
    params.set("max", String(merged.maxPrice));
  if (merged.sort && merged.sort !== "featured")
    params.set("sort", merged.sort);
  if (merged.page && merged.page > 1) params.set("page", String(merged.page));

  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}
