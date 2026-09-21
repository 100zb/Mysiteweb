import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Demo-friendly wildcard so seeded/user-provided cover images & avatars
    // from any host render out of the box. Restrict to known hosts in production.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
