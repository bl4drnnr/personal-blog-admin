# Personal Blog Admin

Admin panel for [mikhailbahdashych.me](https://mikhailbahdashych.me) — React + Vite SPA.

Part of a three-repo system: `personal-blog-api` (content API), `personal-blog-front` (public blog), **personal-blog-admin** (this).

## Architecture

- **Vite + React 19 + TypeScript**, React Router, TanStack Query. One hand-rolled stylesheet reusing the blog's token palette — KISS, no UI framework.
- **Auth**: access token in memory only (never localStorage); the refresh token is the API's HttpOnly cookie. The client refreshes once on a 401 and retries. Real authorization is enforced by the API on every admin endpoint; the client-side gate is UX only.
- **Content editing**: markdown everywhere. The post editor pairs CodeMirror 6 with a live preview rendered by a **vendored copy of the front's markdown pipeline** (`src/lib/markdown.ts` — keep in sync).

## Screens

Login (credentials → TOTP setup/challenge) · Dashboard · Posts (list + editor) · Assets (upload/manage) · About / CV (profile + work/education/certifications CRUD) · Site settings (hero, intro, social links, SEO, footer, maintenance-mode switch) · Security (change password).

## Development

Requires the API running locally (`personal-blog-api`: `npm run dev:infra && npm run migrate && npm run seed && npm run start:dev`).

```bash
cp .env.example .env.local
npm install
npm run dev            # http://localhost:4200
```

| Script | Purpose |
| --- | --- |
| `npm run build` | Production build (static, served by nginx) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Environment

`VITE_API_URL` — base URL of the blog API (inlined at build time).

## Deployment

Static build served by nginx (SPA fallback). Docker image built by `.github/workflows/deploy.yml` → GHCR → SSH deploy into the EC2 compose stack. All infrastructure (Terraform, compose stack, nginx) lives in [personal-blog-infrastructure](https://github.com/mikhailbahdashych/personal-blog-infrastructure) — including the nginx IP allowlist that restricts this panel's vhost to known addresses before auth is even attempted.
