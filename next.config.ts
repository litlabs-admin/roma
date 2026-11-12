import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // DESIGN.md §I.4 — Next 16 only allows listed qualities.
  images: { qualities: [75, 85] },
  cacheComponents: true,
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
