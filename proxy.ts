import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Edge proxy (renamed from "middleware" in Next.js 16):
 * gates /admin behind a signed-in session.
 *
 * Uses the EDGE-COMPATIBLE auth config (no GitHub provider imports
 * here — those live in `auth.ts` and run in the Node runtime). This
 * keeps the edge bundle small.
 *
 * The `authorized` callback in auth.config.ts does the gating logic:
 *   - public site and /admin/login: pass through
 *   - everything else under /admin: require a session, otherwise
 *     NextAuth redirects to /admin/login.
 */
const { auth } = NextAuth(authConfig);
export default auth;

export const config = {
  matcher: ["/admin/:path*"],
};
