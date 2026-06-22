import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16 "proxy" convention (formerly "middleware").
export async function proxy(request) {
  return await updateSession(request);
}

export const config = {
  // Only run on routes that actually need auth. Public pages (home, shop,
  // product, courses, static) skip the proxy entirely → no Supabase round-trip,
  // much faster navigation. Sessions still refresh when visiting these routes.
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/orders/:path*",
    "/checkout/:path*",
  ],
};
