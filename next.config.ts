import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify's Next.js runtime needs a standalone server bundle to build
  // its serverless function around. Setting it explicitly here is more
  // reliable than depending on plugins to set NEXT_PRIVATE_STANDALONE.
  output: "standalone",
  images: {
    // Demo-friendly wildcard so seeded/user-provided cover images & avatars
    // from any host render out of the box. Restrict to known hosts in production.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
