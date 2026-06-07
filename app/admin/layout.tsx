import { auth } from "@/auth";
import Link from "next/link";
import { signOutAction } from "./actions";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const showChrome = Boolean(session?.user);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      {showChrome ? (
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 text-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Signed in as {session!.user!.name ?? session!.user!.email ?? "user"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
            >
              ← Back to site
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded border border-slate-300 px-2 py-1 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      ) : null}
      {children}
    </div>
  );
}
