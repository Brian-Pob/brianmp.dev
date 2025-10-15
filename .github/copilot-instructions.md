<!--
Guidance for AI coding agents working on the brianmp.dev Astro site.
Keep this short, concrete, and focused on the repository's structure, patterns,
and developer workflows that are immediately actionable.
-->

# Copilot / AI Agent Instructions — brianmp.dev

This repository is a personal website built with Astro (v5) and MDX content.
Use the notes below to make productive edits and PRs quickly.

1. Big picture

   - Static site using Astro with output: static (see `astro.config.mjs`).
   - Content lives in `src/content/blog/*` as Astro/MDX collection entries.
   - Pages live in `src/pages/*`. Layouts are in `src/layouts/` and shared
     components in `src/components/`.

2. Dev & build workflow (commands from `package.json`)

   - Local dev: `npm run dev` (starts `astro dev`).
   - Build for production: `npm run build` (runs `astro build`).
   - Preview production build: `npm run preview`.

- This repo contains a `bun.lock` file — prefer bun for local work and CI.
- Install deps: `bun install` (fallback: `npm install` or `npm ci`).
- Local dev: `bun run dev` (runs the `dev` script which calls `astro dev`).
- Build for production: `bun run build` (runs `astro build`).
- Preview production build: `bun run preview`.
- You can still use `npm run ...` if bun isn't available, but prefer bun to match the lockfile.

3. Project conventions and patterns

   - Imports use absolute-ish aliases like `@/` for `src/components` in pages.
   - Images use `astro:assets` `<Image />` where available (see
     `src/pages/blog/index.astro` and `src/pages/index.astro`).
   - Blog collection is fetched with `getCollection('blog')` from
     `astro:content` and filtered by `data.status` (published vs preview).
   - Layouts are lightweight; pages wrap content in `BaseLayout.astro`.

4. Files to reference when making changes

   - Site config: `astro.config.mjs` (site URL, integrations, output)
   - Content: `src/content/blog/*` (MDX posts and frontmatter like `pubDate`,
     `status`, `heroImage`)
   - Entry pages: `src/pages/index.astro`, `src/pages/blog/index.astro`,
     `src/pages/blog/[...slug].astro` (blog routing)
   - Layout & components: `src/layouts/BaseLayout.astro`,
     `src/components/*` (Header, Footer, BaseHead)

5. Styling and assets

   - Uses plain CSS/SCSS with Open Props (see `src/styles/*`).
   - Global constants live in `src/consts.ts` (site title/description).

6. Search & modify patterns (examples)

   - To list blog posts: see `src/pages/blog/index.astro` — it calls
     `getCollection('blog', ({data}) => ...)` and sorts by `data.pubDate`.
   - To add a hero image to a post frontmatter: add `heroImage:` pointing to
     an image file in `src/assets/` or a public path.
   - To change the page head meta: edit `src/components/BaseHead.astro` and
     update how `title`/`description` are consumed (used in pages).

7. Integration points & external dependencies

   - Vercel adapter present (`@astrojs/vercel`) — site intended for Vercel
     deployment; analytics and Speed Insights integration are included.
   - Uses `sharp` for image processing via `astro:assets`.

7.1 Available MCPs / agent integrations

- Astro docs helper: fetches official Astro docs and examples (useful for
  version-accurate guidance on integrations and config). Good for routing,
  assets, and MDX-related questions.
- Upstash Context7 MCP: resolves package/product names to a Context7-compatible
  library ID and retrieves authoritative library docs and examples. Use the
  `resolve-library-id` step first to obtain the exact ID (for example
  `/vercel/next.js`) then call the docs fetcher to get focused documentation
  for the desired topic or API surface.
  - Always use context7 when I need code generation, setup or configuration steps, or
    library/API documentation. This means you should automatically use the Context7 MCP
    tools to resolve library id and get library docs without me having to explicitly ask.
- GitHub MCPs: create/update PRs, list PRs/issues, add comments, push files,
  read file contents and list branches — use these when making repo changes
  and creating PRs on behalf of maintainers.
- Runtime inspector (console-ninja): retrieve runtime logs and errors from
  the running app — useful when debugging build/runtime issues in preview
  environments.

Note: These MCPs are agent-facing integrations available in the environment
for automated code and PR operations. Prefer using them for authoritative
reads/writes (for example, creating a branch + push or retrieving a file
for editing) rather than manual shell instructions.

8. Quality gates and quick checks

   - There is no test framework in the repo. Fast verification steps:
     - `npm run dev` to verify dev server builds pages.
     - `npm run build` to ensure the static build succeeds.
   - Linting: `@biomejs/biome` is a devDependency; run if configured in
     CI or `biome` scripts exist locally.

9. Security & secrets

   - No secrets in repo. Do not add credentials. Vercel-specific settings
     are expected to live in platform env vars, not in repo files.

10. Small editorial rules for PRs

- Keep changes focused to a single concern (layout, styling, content).
- When editing posts, preserve frontmatter keys: `title`, `pubDate`,
  `status` (use `preview` for drafts visible locally).
- Prefer minimal changes to `src/components/*` — small, testable updates.

If anything in this file is unclear or you need a deeper explanation of the
blog content pipeline, ask for exact files you'd like explained.
