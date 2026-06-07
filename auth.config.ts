import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config (no Node.js-only imports here).
 * Used by middleware at the edge runtime.
 *
 * The full config (with the GitHub provider) lives in `auth.ts` and pulls
 * this in. Keeping the providers in a separate file ensures the middleware
 * stays small and edge-portable.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname.startsWith("/admin/login");

      if (isOnAdmin && !isOnLogin) {
        return isLoggedIn;
      }
      return true;
    },
  },
  // Providers are added in `auth.ts` so they don't bloat the edge bundle.
  providers: [],
} satisfies NextAuthConfig;
