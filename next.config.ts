import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // DESIGN.md §I.4 — Next 16 only allows listed qualities.
  images: { qualities: [75, 85] },
  cacheComponents: true,
  // Brief §1.1: /roi is the short link for the calculator (a 301, not Next's default 308).
  async redirects() {
    return [{ source: "/roi", destination: "/calculator", statusCode: 301 }];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      // Tailwind for global CSS only: renaming *.module.css "as *.css" would strip
      // CSS-module scoping (every imported class became undefined).
      "*.css": {
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
