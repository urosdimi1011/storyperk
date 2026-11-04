import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skoro sve stranice su dinamične (kupon, sesija, baza), pa Cache Components
  // za sada isključujemo; uključićemo ga kad budemo keširali landing i statiku.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
