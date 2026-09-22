import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify's Next.js runtime needs a standalone server bundle to build
  // its serverless function around. Vercel does its own file tracing and
  // explicitly advises against this mode, so only set it off-Vercel.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  images: {
    // Demo-friendly wildcard so seeded/user-provided cover images & avatars
    // from any host render out of the box. Restrict to known hosts in production.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
