import type { NextConfig } from "next";

// Canonical URLs, the sitemap and structured data are built from NEXT_PUBLIC_SITE_URL. An indexable
// build without the real domain would point search engines at localhost.
const productionUrl = /^https:\/\/(?!localhost|127\.0\.0\.1)[^/]+$/;
if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" && !productionUrl.test((process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, ""))) {
  throw new Error("NEXT_PUBLIC_ALLOW_INDEXING=true needs NEXT_PUBLIC_SITE_URL set to the production https:// domain, e.g. https://royalwaterproofingco.com");
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  // The e2e suite also builds a preview copy (sample content shown) into its own folder.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  images: {
    // AVIF where the browser supports it: a fifth to over half smaller than WebP for these photos, at matched visual quality.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Turbopack's build cache (on by default since Next 16.3) saves the build's whole environment, server-only
    // secrets like LEADS_API_KEY included, to .next/cache/turbopack, which fails Netlify's secrets scan.
    turbopackFileSystemCacheForBuild: false,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
