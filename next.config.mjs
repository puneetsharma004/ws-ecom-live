const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Applied by browsers only over HTTPS (e.g. on Vercel).
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve modern formats (AVIF/WebP), resized to the displayed size.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Seed/design imagery (Google "aida" CDN).
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Supabase Storage public URLs (admin-uploaded product images).
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
