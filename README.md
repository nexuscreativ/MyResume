# Resume CMS

A dynamic, single-page portfolio + content management system for **Efemena Derek Idjai** (Senior Systems Programmer), built with **Next.js 16 + TypeScript + Tailwind + Auth.js v5 + Octokit**.

Edit your resume from `/admin`, push changes to GitHub from a custom self-hosted admin (no SaaS, no TinaCMS), and let Vercel auto-rebuild.

---

## Highlights

- **One-page portfolio** with filterable timeline (1994–2025), multi-select tag chips, asymmetric 25/75 grid, dark mode, PDF export (filter-aware)
- **Self-hosted custom admin** at `/admin` — collapsible sections, per-section save, file upload, brand-faithful UI
- **Auth.js v5 + GitHub OAuth** with allow-list sign-in
- **GitHub-API commits** in production — edits go to `content/site/site.json` via Octokit, Vercel auto-rebuilds
- **No SaaS lock-in**, no database, no codegen, no `tinacms build` OOM
- **Single Next process** in dev (`npm run dev` = one port), no multi-process drama

---

## Stack

| Layer       | Tool                                            |
|-------------|-------------------------------------------------|
| Framework   | Next.js 16.2.7 (App Router, Turbopack)          |
| Language    | TypeScript 5 (strict)                           |
| Styling     | Tailwind CSS 4 + Slate palette + emerald accent |
| Auth        | next-auth@5.0.0-beta.31 (Auth.js v5)            |
| OAuth       | GitHub provider                                 |
| Persistence | `content/site/site.json` (file) + Octokit (prod)|
| PDF         | html2pdf.js                                     |
| Image opts  | sharp (saliency-based portrait→landscape crop)  |
| Font        | Inter (variable)                                |

---

## Local development

### 1. Clone and install

```powershell
git clone <repo>
cd myprofiler
npm install
```

### 2. Configure `.env.local`

Copy `.env.example` to `.env.local` and fill in the values:

```powershell
Copy-Item .env.example .env.local
```

At minimum you need:

- `AUTH_SECRET` — generate with:
  ```powershell
  $bytes = New-Object byte[] 32
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  [Convert]::ToBase64String($bytes)
  ```
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — from a [GitHub OAuth App](https://github.com/settings/developers) (Authorization callback URL: `http://localhost:3000/api/auth/callback/github` for local dev)
- `ADMIN_GITHUB_LOGIN` — your GitHub username (allow-list; leave empty only for solo local dev)

In dev, `GITHUB_TOKEN` / `GITHUB_REPO_*` are **not** required — `lib/database.ts` writes to the local filesystem instead.

### 3. Run

```powershell
npm run dev
```

- Public site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin` (redirects to `/admin/login`)
- Single port, single process, hot-reload on `content/site/site.json`

### 4. Optimize your headshot (one-time)

Place a high-res portrait at `public/headshot-source.jpg` then:

```powershell
npm run optimize:avatar
```

This generates 10 saliency-cropped variants in `public/uploads/avatars/`.

### 5. Available scripts

| Command                  | Purpose                                          |
|--------------------------|--------------------------------------------------|
| `npm run dev`            | Next dev (Turbopack) on `:3000`                  |
| `npm run build`          | Production build (one process, ~5 min)           |
| `npm run start`          | Serve the production build                       |
| `npm run lint`           | ESLint                                           |
| `npm run typecheck`      | `tsc --noEmit`                                   |
| `npm run optimize:avatar`| Generate 10 avatar variants from a source image  |

---

## Deploying to Vercel

### Prerequisites

1. A **GitHub account** hosting this repo (Vercel will read from it on every commit).
2. A **Vercel account** — https://vercel.com/signup (free tier is fine).
3. A **GitHub OAuth App** — https://github.com/settings/developers → New OAuth App
   - **Homepage URL**: your eventual Vercel domain (e.g. `https://resume.vercel.app`)
   - **Authorization callback URL**: `https://<your-vercel-domain>/api/auth/callback/github`
   - You will add a second callback URL for `http://localhost:3000/api/auth/callback/github` if you also want to sign in locally.
4. A **GitHub Personal Access Token (fine-grained)** — https://github.com/settings/tokens?type=beta
   - Repository access: **only this repo**
   - Permissions: **Contents: Read and write** (Octokit needs to commit to `content/site/site.json` and `public/uploads/...`)

### Step-by-step

1. **Push the repo to GitHub** (if you haven't):
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin git@github.com:YOUR_USERNAME/myprofiler.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to https://vercel.com/new
   - Select the GitHub repo
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `.`
   - Build Command: `npm run build` (default — Vercel picks this up)
   - Output Directory: `.next` (default)
   - **Do not deploy yet** — first add env vars.

3. **Add environment variables** in Vercel → Project → Settings → Environment Variables:

   | Name                    | Value                              | Notes                                   |
   |-------------------------|------------------------------------|-----------------------------------------|
   | `AUTH_SECRET`           | (32+ char base64 string)           | Required for JWT signing                |
   | `ADMIN_GITHUB_LOGIN`    | (your GitHub username)             | Allow-list — gates `/admin`             |
   | `GITHUB_CLIENT_ID`      | (from OAuth App)                   |                                         |
   | `GITHUB_CLIENT_SECRET`  | (from OAuth App)                   |                                         |
   | `GITHUB_TOKEN`          | (fine-grained PAT)                 | Octokit commits back to repo            |
   | `GITHUB_REPO_OWNER`     | (your GitHub username or org)      |                                         |
   | `GITHUB_REPO_NAME`      | `myprofiler`                       |                                         |
   | `GITHUB_REPO_BRANCH`    | `main`                             | Default                                 |
   | `NEXT_PUBLIC_SITE_URL`  | (your Vercel domain URL)           | Used for og:url and metadataBase        |

   > Set these for **Production** at minimum. Mirror them to **Preview** if you want to test admin saves on PRs (optional).

4. **Deploy**:
   - Click Deploy. First build takes ~5 min.
   - Note the assigned domain: `<project-name>.vercel.app`.

5. **Update the GitHub OAuth callback**:
   - Go back to https://github.com/settings/developers → your OAuth App
   - Add a second Authorization callback URL: `https://<your-domain>.vercel.app/api/auth/callback/github`
   - Save.

6. **Custom domain** (optional):
   - Vercel → Project → Settings → Domains → add your domain
   - Update DNS as instructed (CNAME for `www`, A for apex, or Vercel nameservers)
   - Add the apex/www domain as a third Authorization callback URL on the GitHub OAuth App
   - Update `NEXT_PUBLIC_SITE_URL` to the new domain and redeploy

7. **Sign in to admin**:
   - Visit `https://<your-domain>/admin`
   - Click **Continue with GitHub** and authorize the OAuth app
   - You should land on the editable dashboard

### How production saves work

When you click **Save** in the admin:

1. `app/admin/actions.ts` validates the payload server-side.
2. `lib/database.ts` reads `content/site/site.json` from the repo via Octokit (`repos.getContent`) to get its current `sha`.
3. It calls `repos.createOrUpdateFileContents` with the new JSON + sha + a section-specific commit message.
4. GitHub writes the new commit.
5. Vercel detects the commit and triggers a rebuild (~30–60 s).
6. `revalidatePath('/')` flushes the ISR cache so subsequent visits see the new content immediately on the next deploy.

For **file uploads** (avatar, project images), the same Octokit flow commits the binary to `public/uploads/<subdir>/<uuid>.<ext>`.

> **First-time setup caveat**: if your repo's `main` branch is protected and requires PRs + reviews, the commit from Octokit will fail. Either disable that rule for the workflow or pre-merge a README commit to bootstrap.

---

## Admin guide

`/admin` has **12 collapsible sections** matching `content/site/site.json`:

| Section        | What you edit                                                    |
|----------------|------------------------------------------------------------------|
| Profile        | Name, title, tagline, summary, contact email, location           |
| Avatar         | Image upload (replaces the default headshot)                     |
| Experience     | List of roles (title, company, period, summary, skills)          |
| Education      | List of degrees + a free-text "additional note"                  |
| Education note | The free-text note above                                          |
| Skills         | Skill categories (name + list of skill chips)                    |
| Certifications | Badges with status (active/expired/in-progress)                  |
| Projects       | Projects with name, period, summary, skills, link, image         |
| Interests      | Free-text list of interest tags                                  |
| Languages      | Free-text list of language tags                                  |
| Referees       | Contact list (name, role, company, email, phone)                 |
| Social         | Social media links (10 platforms incl. LinkedIn, GitHub, etc.)   |

Each section has its own **Save** button with a 3-second "Saved ✓" confirmation.

**File uploads** (avatar, project images): click the field → pick a file → it uploads via Octokit → preview + **Replace/Remove** controls appear.

**Image constraints**: JPEG / PNG / WebP / GIF / SVG, max 10 MB.

---

## How content flows

```
public site (/)          admin (/admin)
  ↓ static import          ↓ server action
  lib/content.ts           app/admin/actions.ts
  ↓                        ↓
content/site/site.json  ←  lib/database.ts
                           ↓ dev: fs.writeFile
                           ↓ prod: Octokit commit
                              ↓
                            GitHub push
                              ↓
                            Vercel auto-rebuild (~30–60s)
```

In **dev**, the public site hot-reloads `site.json` on the next request. In **prod**, edits commit to the repo, Vercel rebuilds, and the public site updates within a minute.

---

## Troubleshooting

**`/admin` redirects to `/admin/login?callbackUrl=/admin` in a loop.**
Check `AUTH_SECRET` is set. Restart `npm run dev` (or redeploy on Vercel) after changing env vars.

**`/admin/login` shows a 500 / `CLIENT_FETCH_ERROR`.**
The GitHub OAuth App's Authorization callback URL must match the origin exactly (scheme + host + path). Add the current origin's `/api/auth/callback/github` to the OAuth App.

**Sign-in succeeds but `authorized` returns `false` (silent redirect back to login).**
`ADMIN_GITHUB_LOGIN` is set but doesn't match the GitHub username you're signing in with. Either set it to your actual username or leave it empty for open access (only safe in solo local dev).

**Save click says "Failed to commit to GitHub".**
`GITHUB_TOKEN` is missing, expired, lacks Contents: R/W on the target repo, or the branch is protected. Test with `curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/repos/OWNER/REPO`.

**Vercel build fails with `Type error`.**
`npx tsc --noEmit` locally first; commit the fix. Vercel also runs `tsc`.

**`next build` is slow (~5 min) on first deploy.**
Turbopack is incremental on subsequent builds. The 5-min cost is mostly first-time asset optimization + type checking; subsequent deploys are faster.

**`/admin` shows `Local mode` banner in production.**
`GITHUB_TOKEN` / `GITHUB_REPO_*` are not set. `lib/database.ts` falls back to local fs writes, which fail in Vercel's read-only filesystem — fills appear to succeed, but data isn't persisted.

---

## Project structure

```
myprofiler/
├─ app/
│  ├─ admin/
│  │  ├─ _components/      EditForm, fields, cards, icons
│  │  ├─ actions.ts        saveSection, uploadImage, signOutAction
│  │  ├─ layout.tsx        Admin chrome
│  │  ├─ login/page.tsx    GitHub sign-in
│  │  └─ page.tsx          Auth-gated dashboard
│  ├─ api/auth/[...nextauth]/route.ts
│  ├─ icon.svg             Brand favicon
│  ├─ layout.tsx           Root layout (Inter, dark mode)
│  ├─ page.tsx             Public site
│  └─ globals.css
├─ components/             Header, Sidebar, sections, filters, social-icons
├─ content/site/site.json  SINGLE SOURCE OF TRUTH
├─ lib/
│  ├─ content.ts           Static import for public site
│  └─ database.ts          readSite / writeSite / uploadImage / persistenceMode
├─ public/                 avatar, uploads/, sw.js, browserconfig.xml
├─ scripts/optimize-avatar.mjs
├─ types/site.ts           All site data types
├─ auth.config.ts          Edge-compatible NextAuth config (no providers)
├─ auth.ts                 Full NextAuth config with GitHub provider
├─ proxy.ts                Next 16 edge proxy (was middleware.ts in v15)
├─ next.config.mjs         Image remote patterns
├─ tailwind.config.ts
├─ tsconfig.json           strict, paths "@/*"
├─ .env.example            8 env vars documented
└─ .env.local              (gitignored) your secrets
```

---

## License

Private portfolio. All rights reserved.
