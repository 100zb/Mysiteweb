import type { NextAuthConfig } from "next-auth";

// Edge-safe subset of the Auth.js config: no Prisma adapter, no bcrypt,
// no database driver. This is what proxy.ts (bundled as an Edge Function
// on hosts like Netlify) is allowed to import. The full config in
// auth.ts adds the adapter and providers on top of this.
export const authConfig = {
  // Netlify (like most non-Vercel hosts) isn't auto-trusted by Auth.js,
  // which otherwise rejects the request's Host header as a spoofing
  // guard. Safe here since NEXT_PUBLIC_SITE_URL/AUTH_URL pin the real
  // origin and the host still comes through Netlify's own proxy.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as { username?: string | null }).username;
        token.role = (user as { role?: string }).role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string | null;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
