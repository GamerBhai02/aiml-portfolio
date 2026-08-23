# Abu Talha Ansari — AI/ML Portfolio (Dynamic 3D Portfolio Template)

A production-ready, **fully dynamic 3D portfolio website** for AI/ML engineers,
data scientists and developers. Built with **React 18**, **Vite**, **React Three
Fiber** and **Firebase (Firestore + Auth)**, deployable to **Netlify** in minutes.

Everything you see is stored in Firestore and managed from a password-protected
**admin panel at `/admin`** — no code edits needed to update your site. The repo
ships with **zero pre-seeded data**, so it is a clean template anyone can fork
and make their own.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start (5 minutes)](#quick-start-5-minutes)
- [Firebase Setup](#firebase-setup)
- [Content & Admin Guide](#content--admin-guide)
- [Data Model (Firestore collections)](#data-model-firestore-collections)
- [Ordering Content](#ordering-content)
- [Deploy to Netlify](#deploy-to-netlify)
- [Make It Yours](#make-it-yours)
- [Security](#security)
- [SEO Tips](#seo-tips)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

- **3D AI-themed hero** — particle nebula, wireframe core and sparkles powered by
  React Three Fiber, mouse-reactive and GPU-accelerated.
- **Fully dynamic** — profile, education, skills, projects, patents, research
  papers, certifications, achievements and blog posts all live in Firestore.
- **Admin panel** (`/admin`) — email/password login, then add / edit / delete /
  reorder everything from a dashboard. No Firebase console needed day-to-day.
- **Blog engine** — write posts in the admin panel, publish or keep as drafts;
  public readers only see published posts.
- **Sections render only when they have content** — an empty section is not shown
  at all, so the page stays clean while you build it out.
- **Manual ordering** — numeric order field + up/down arrows in the admin panel
  control the exact order of every section's entries.
- **Responsive** — mobile-first breakpoints at 900px and 640px; hamburger menu,
  single-column grids and a 3D scene that scales to any screen.
- **Netlify-ready** — `netlify.toml` build config + `public/_redirects` for SPA
  routing out of the box.
- **Zero pre-seeded data** — the site shows graceful empty states until you add
  your own content.

## Tech Stack

| Layer | Tech |
|---|---|
| UI | React 18, React Router 6 |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| Backend | Firebase Firestore (data), Firebase Auth (admin login) |
| Build | Vite 5 |
| Hosting | Netlify (static SPA + `_redirects`) |

## Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Configure Firebase (see next section), then:
cp .env.example .env

# 3. Run locally
npm run dev
```

Open **http://localhost:5173** to see the site and **http://localhost:5173/admin**
to log in and add your content.

## Firebase Setup

1. Go to https://console.firebase.google.com and **create a project**.
2. **Firestore Database** → Create database → start in **production mode**.
3. **Authentication** → Sign-in method → enable **Email/Password**.
4. **Authentication** → Users → **Add user** with your email + a strong password.
   This single account is your admin login. **Do not enable public registration.**
5. **Project Settings → Your apps → Web (`</>`)** → register a web app, copy the
   config object into `.env` (keys are already listed in `.env.example`):

   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

6. Deploy the security rules (public read, signed-in write). First link the CLI
   to your project — without this you get the
   `No currently active project` error:

   ```bash
   npm i -g firebase-tools
   firebase login
   firebase use --add   # pick your project, give it any alias, e.g. default
   firebase deploy --only firestore:rules
   ```

   > **Windows note:** right after `firebase use --add` you may see
   > `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c`.
   > This is a known cosmetic Node.js crash at CLI exit — the alias is already
   > saved (check `.firebaserc` exists) and you can safely continue deploying.

7. Done. Log in at `/admin` and add your data.

## Content & Admin Guide

Log in at `/admin` (you created the user in step 4 above). The dashboard has a
tab for every section:

| Tab | What you can manage |
|---|---|
| Profile | Name, title, tagline, bio, email, location, university, resume URL, avatar URL |
| Social Links | GitHub, LinkedIn, LeetCode, Twitter/X, Instagram, Telegram, website |
| Education | Institution, degree, field, years, description |
| Skills | Name, category, proficiency 0–100 |
| Projects | Title, description, tech stack, GitHub/demo/image URLs |
| Patents | Title, patent number, status, year, description |
| Research Papers | Title, authors, journal, year, link, summary |
| Certifications | Title, issuer, year, credential URL, description |
| Achievements | Title, year, description |
| Blog | Title, tags, cover image, content, **published** checkbox |

The public site reflects changes instantly — there is no rebuild or redeploy.

## Data Model (Firestore collections)

All collections are created automatically on first write — nothing to pre-create.

| Collection | Document | Purpose |
|---|---|---|
| `profile` | `main` (fixed id) | Name, title, tagline, bio, email, location, resume, avatar, `socials` object |
| `education` | auto | Institution, degree, field, years, description |
| `skills` | auto | Name, category, proficiency |
| `projects` | auto | Title, description, tech, GitHub/demo/image |
| `patents` | auto | Title, number, status, year, description |
| `papers` | auto | Title, authors, journal, year, link, summary |
| `certifications` | auto | Title, issuer, year, credential URL, description |
| `achievements` | auto | Title, year, description |
| `blog` | auto | Title, tags, cover image, content, published flag |

Every entry also stores `createdAt` (server timestamp) and an optional `order`
number. Documents without `createdAt` are **not** dropped — they sort to the end.

## Ordering Content

- **Admin panel:** use the up/down arrows next to an entry to reorder the whole
  list, or type an **Order** number (lower = appears first) in the add/edit form.
- **Fallback:** entries without an explicit order appear after all ordered ones,
  newest first by creation date.

## Deploy to Netlify

**Option A — Git integration (recommended):** push this repo to GitHub, then in
Netlify choose *Import from Git*. The build command (`npm run build`) and publish
directory (`dist`) are already configured in `netlify.toml`.

**Option B — Drag & drop:** `npm run build`, then drop the `dist` folder onto
https://app.netlify.com/drop.

**Option C — Netlify CLI:**

```bash
npm i -g netlify-cli
netlify deploy --prod
```

**Important:** Netlify does not read your local `.env`. Add the same
`VITE_FIREBASE_*` values under **Site settings → Environment variables**, then
trigger a new deploy.

## Make It Yours

1. **Your name** — it is hard-coded in a few places for SEO and branding:
   - `src/siteConfig.js` — `SITE_URL` (replace with your real domain), `SITE_NAME`.
   - `index.html` — `<title>`, meta description, Open Graph tags and JSON-LD
     `Person` + `WebSite` schema.
   - `src/components/Footer.jsx` — the copyright line
     `© {year} Abu Talha Ansari. All rights reserved.`
   - The **navbar brand**, **hero name** and **About section** pull your name
     from the Firestore profile, so update it once in Admin → Profile.
2. **Your favicon** — replace the inline SVG data-URL in `index.html` or add a
   `public/favicon.svg`.
3. **Your look** — all colors, fonts and spacing live in `src/index.css`
   (`--bg`, `--grad`, `--font-head`, etc.).

## Security

The shipped `firestore.rules` allow **public read** and **any signed-in user may
write**. That is safe as long as the only account in Firebase Authentication is
your own admin (public registration is disabled). To lock writes to one account,
replace the write rule with your UID (visible in Authentication → Users):

```
allow write: if request.auth != null && request.auth.uid == "YOUR_ADMIN_UID";
```

Never commit a real `.env` — it is already git-ignored.

## SEO Tips

- **Per-page meta is automatic** — `src/hooks/usePageMeta.js` sets the
  `document.title`, meta description, canonical URL, Open Graph tags and robots
  directive on every route. Blog posts get their own title/description/OG image
  from the post content; the admin panel is `noindex`.
- **Set your real domain** in `src/siteConfig.js` (`SITE_URL`), then update the
  same URL in `public/robots.txt` and `public/sitemap.xml`. Submit the sitemap
  in Google Search Console.
- Blog posts and project titles become the page's most crawlable text — use
  descriptive titles and write 2+ sentences of description.
- **Crawler caveat:** this is a client-rendered SPA, so the HTML shell is
  static. Googlebot runs JavaScript and will see the rendered content, but if
  you want pre-rendered HTML for all crawlers, add an SSR/prerender layer
  (e.g. Vite SSR or a prerender service) on top.

## Troubleshooting

| Problem | Fix |
|---|---|
| `No currently active project` on `firebase deploy` | Run `firebase use --add` first (see Firebase Setup). |
| Page shows "Could not load the portfolio" | `.env` is missing/wrong, or Firestore rules not deployed. |
| New entries don't appear | Check the entry exists in Admin → the relevant tab; drafts stay hidden until **published**. |
| 3D scene is slow | Disable/limit `Sparkles` in `src/components/Scene3D.jsx` or reduce `particleCount`. |
| `Assertion failed: ...async.c` on Windows | Cosmetic Node.js CLI-exit crash; ignore it (config is already saved). |

## License

MIT — use it freely for your own portfolio.
