import siteData from "@/content/site/site.json";
import type { SiteData } from "@/types/site";

/**
 * Static import of the site singleton for the PUBLIC site.
 *
 * Why static and not async: the public page is a client component
 * that bundles `profile` at build time. After an admin save, the
 * JSON file is updated on disk (dev) or in the GitHub repo (prod,
 * which triggers a Vercel rebuild). The public site then picks up
 * the new data on the next request after the rebuild completes.
 *
 * The admin uses `lib/database.ts` directly for reads/writes, so
 * no async coordination is needed there.
 */
export const profile = siteData as SiteData;
export type { SiteData };