import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Security headers — protects against XSS, clickjacking, MIME sniffing, etc.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking — only allow your own site to iframe
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Block MIME type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Enable XSS protection in older browsers
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Control referrer information sent
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions policy — disable unnecessary browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
          },
          // Strict Transport Security — force HTTPS for 1 year
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
      // Extra strict headers for admin panel
      {
        source: "/vinayd/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
      // No cache for API routes
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },

  // Redirect www to non-www for SEO consistency
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.vivaai.in" }],
        destination: "https://vivaai.in/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
