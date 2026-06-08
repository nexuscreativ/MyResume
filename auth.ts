import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

/**
 * Full auth setup with two providers:
 *   1. Credentials (username/password) — gated by ADMIN_USERNAME / ADMIN_PASSWORD
 *   2. GitHub OAuth — gated by ADMIN_GITHUB_LOGIN allow-list
 *
 * Runs in the Node.js runtime (route handler, server actions).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const adminUser = process.env.ADMIN_USERNAME;
        const adminPass = process.env.ADMIN_PASSWORD;
        if (
          credentials.username === adminUser &&
          credentials.password === adminPass
        ) {
          return { id: "1", name: credentials.username as string };
        }
        return null;
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: { params: { scope: "read:user user:email" } },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    signIn({ profile, account }) {
      // Credentials: already validated in authorize().
      if (account?.provider === "credentials") return true;
      // GitHub OAuth: check allow-list.
      const allowed = process.env.ADMIN_GITHUB_LOGIN;
      if (!allowed) return true;
      return Boolean(profile && (profile as { login?: string }).login === allowed);
    },
  },
});
