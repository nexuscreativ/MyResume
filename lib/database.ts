import { promises as fs } from "node:fs";
import path from "node:path";
import { Octokit } from "@octokit/rest";
import type { SiteData } from "@/types/site";

/**
 * Persistence layer for the site singleton.
 *
 * Dev (NODE_ENV=development OR no GitHub creds):
 *   - reads/writes content/site/site.json on the local file system
 *
 * Prod (NODE_ENV=production with GITHUB_TOKEN + GITHUB_REPO_OWNER
 * + GITHUB_REPO_NAME + GITHUB_REPO_BRANCH):
 *   - reads the JSON from the GitHub API
 *   - writes the JSON back to the repo via the Contents API
 *     (triggers a Vercel auto-rebuild)
 *   - file uploads go to public/uploads/<subdir>/<name> on the repo
 *
 * Throws a clear Error if prod env vars are missing.
 */

const isProd = process.env.NODE_ENV === "production";
const REPO_OWNER = process.env.GITHUB_REPO_OWNER ?? "";
const REPO_NAME = process.env.GITHUB_REPO_NAME ?? "";
const REPO_BRANCH = process.env.GITHUB_REPO_BRANCH ?? "main";
const TOKEN = process.env.GITHUB_TOKEN ?? "";

const hasGitHub = Boolean(TOKEN && REPO_OWNER && REPO_NAME);

const LOCAL_SITE_PATH = path.join(process.cwd(), "content", "site", "site.json");
const LOCAL_UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

const octokit = hasGitHub ? new Octokit({ auth: TOKEN }) : null;

function requireGitHub() {
  if (!octokit) {
    throw new Error(
      "GitHub persistence is not configured. In production, set GITHUB_TOKEN, " +
        "GITHUB_REPO_OWNER, GITHUB_REPO_NAME, and GITHUB_REPO_BRANCH. " +
        "In development, the local file system is used."
    );
  }
}

function jsonToBase64(json: string): string {
  return Buffer.from(json, "utf-8").toString("base64");
}

function base64ToJson(b64: string): string {
  return Buffer.from(b64, "base64").toString("utf-8");
}

/**
 * Read the current site singleton.
 */
export async function readSite(): Promise<SiteData> {
  if (!isProd || !octokit) {
    const raw = await fs.readFile(LOCAL_SITE_PATH, "utf-8");
    return JSON.parse(raw) as SiteData;
  }
  const { data } = await octokit.rest.repos.getContent({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path: "content/site/site.json",
    ref: REPO_BRANCH,
  });
  if (Array.isArray(data) || data.type !== "file") {
    throw new Error("content/site/site.json is not a file");
  }
  return JSON.parse(base64ToJson(data.content)) as SiteData;
}

/**
 * Write the site singleton. Pass a section name for a clearer commit
 * message (e.g. "profile", "experience", "skills").
 */
export async function writeSite(
  data: SiteData,
  sectionLabel: string
): Promise<void> {
  const json = JSON.stringify(data, null, 2) + "\n";

  if (!isProd || !octokit) {
    await fs.writeFile(LOCAL_SITE_PATH, json, "utf-8");
    return;
  }
  requireGitHub();

  // Need the current sha to update an existing file.
  const { data: current } = await octokit.rest.repos.getContent({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path: "content/site/site.json",
    ref: REPO_BRANCH,
  });
  if (Array.isArray(current) || current.type !== "file") {
    throw new Error("content/site/site.json is not a file");
  }

  await octokit.rest.repos.createOrUpdateFileContents({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path: "content/site/site.json",
    message: `chore(site): update ${sectionLabel} via /admin`,
    content: jsonToBase64(json),
    sha: current.sha,
    branch: REPO_BRANCH,
  });
}

const ALLOWED_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

export interface UploadResult {
  url: string;
  bytes: number;
  contentType: string;
}

/**
 * Upload an image to public/uploads/<subdir>/<name> and return the
 * public URL (e.g. "/uploads/avatars/abc123.png").
 *
 * `subdir` is restricted to "avatars" or "projects" for now.
 */
export async function uploadImage(
  bytes: Uint8Array,
  contentType: string,
  subdir: "avatars" | "projects",
  originalName: string
): Promise<UploadResult> {
  if (!ALLOWED_IMAGE_MIME.has(contentType)) {
    throw new Error(
      `Unsupported image type: ${contentType}. Allowed: ${[...ALLOWED_IMAGE_MIME].join(", ")}`
    );
  }
  if (bytes.byteLength > MAX_UPLOAD_BYTES) {
    throw new Error(
      `File too large: ${bytes.byteLength} bytes (max ${MAX_UPLOAD_BYTES}).`
    );
  }

  const ext = inferExtension(contentType, originalName);
  const baseName = sanitizeBaseName(originalName);
  const fileName = `${baseName}-${crypto.randomUUID()}.${ext}`;
  const relativePath = `public/uploads/${subdir}/${fileName}`;
  const publicUrl = `/uploads/${subdir}/${fileName}`;

  if (!isProd || !octokit) {
    const targetDir = path.join(LOCAL_UPLOADS_ROOT, subdir);
    await fs.mkdir(targetDir, { recursive: true });
    const targetPath = path.join(targetDir, fileName);
    await fs.writeFile(targetPath, bytes);
    return { url: publicUrl, bytes: bytes.byteLength, contentType };
  }
  requireGitHub();

  await octokit.rest.repos.createOrUpdateFileContents({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path: relativePath,
    message: `chore(uploads): add ${fileName} via /admin`,
    content: Buffer.from(bytes).toString("base64"),
    branch: REPO_BRANCH,
  });
  return { url: publicUrl, bytes: bytes.byteLength, contentType };
}

function inferExtension(
  contentType: string,
  originalName: string
): string {
  const fromName = originalName.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{1,5}$/.test(fromName)) {
    return fromName;
  }
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";
    default:
      return "bin";
  }
}

function sanitizeBaseName(name: string): string {
  const stem = name.split(".").slice(0, -1).join(".");
  return (
    stem
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "image"
  );
}

/**
 * Which persistence mode is in use. Useful for surfacing a banner
 * in the admin ("Editing locally" vs "Editing on GitHub").
 */
export function persistenceMode(): "local" | "github" {
  return !isProd || !octokit ? "local" : "github";
}
