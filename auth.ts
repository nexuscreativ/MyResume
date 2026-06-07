import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { authConfig } from "./auth.config";

/**
 * Full auth setup with the GitHub provider.
 * Runs in the Node.js runtime (route handler, server actions).
 *
 * To restrict /admin to a single GitHub account, set ADMIN_GITHUB_LOGIN
 * in your env (your GitHub username). When unset, ANY GitHub user can
 * sign in — fine for solo local dev, NOT for production.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      // We only need the user's GitHub identity for /admin gating.
      authorization: { params: { scope: "read:user user:email" } },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    signIn({ profile }) {
      const allowed = process.env.ADMIN_GITHUB_LOGIN;
      if (!allowed) {
        // No allow-list configured — open the gates.
        return true;
      }
      // GitHub profile includes `login` (the username).
      return Boolean(profile && (profile as { login?: string }).login === allowed);
    },
  },
});
