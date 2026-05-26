# goicouria.com

A single-page-feeling digital garden. Astro + TypeScript + MDX + hand-written
CSS, self-hosted variable fonts, deployed to Vercel.

## Quick start

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # builds to ./dist
npm run preview # serves the build
npm run check   # astro check (types + .astro)
```

Requires Node 18.20+ or 20.3+.

## How it's organized

```
src/
  content.config.ts        # Zod schemas for both collections
  content/
    garden/                # one .md per stream item
    writing/               # one .mdx per long-form essay
  components/
    Sidebar.astro          # portrait + the four-link column (left col)
    Header.astro           # name + slot for pips + bio
    Pips.astro             # role filter (with the only client script)
    GardenItem.astro       # single item in the Trajectory stream
    ThemeToggle.astro      # light/dark switch
    Footer.astro           # minimal bottom band: © + theme toggle
  layouts/
    BaseLayout.astro       # <head>, theme bootstrap, font imports
  pages/
    index.astro            # the landing (sidebar + main grid)
    writing/[...slug].astro# essay route
    rss.xml.ts             # RSS feed
    llms.txt.ts            # /llms.txt for crawlers (llmstxt.org spec)
    404.astro
  styles/
    tokens.css             # all design tokens live here
    global.css             # layout, components, utility
    prose.css              # long-form essay typography
public/
  portrait.svg             # placeholder portrait — replace with a real photo
  robots.txt
  favicon.svg
  cv.pdf                   # add yours here; the sidebar's CV link points to /cv.pdf
  og-default.png           # add a 1200×630 OG image
```

## Adding a new garden item

Create `src/content/garden/<slug>.md`:

```yaml
---
title: "The thing's title"
description: "One to three sentences. This appears in the stream."
roles: ["scientist"]            # any subset of scientist | developer | worldbuilder
date: 2026-05-10                # ISO date
link: "https://example.org/x"   # external URL — OR omit and use internalSlug
# internalSlug: "essay-slug"    # to link to /writing/<slug> instead
# thumbnail: "/images/x.png"    # optional, place file in public/images/
# featured: true                # appears under "Selected"
# draft: true                   # hidden from build until ready
---

Body content is currently unused — the description in frontmatter is
what shows in the stream.
```

The build will fail with a clear error if frontmatter doesn't match the
schema in [content.config.ts](src/content.config.ts).

## Adding a new long-form essay

Create `src/content/writing/<slug>.mdx`:

```yaml
---
title: "The essay's title"
description: "A one- or two-sentence summary for OG / RSS / llms.txt."
date: 2026-05-10
roles: ["scientist", "developer"]   # optional
---

# Or skip the H1 — the template renders title from frontmatter.

Body content in MDX. Headings, blockquotes, lists, code blocks, images,
embedded components all work. Styled by `src/styles/prose.css`.
```

The file's name becomes its URL: `essay-slug.mdx` → `/writing/essay-slug`.

To get the essay to appear in the stream too, add a matching garden item
with `internalSlug: "essay-slug"` and no `link`.

## Design

A short tour, in case you want to iterate the visuals:

- **Tokens** — all colors, type scale, spacing, motion, font stacks
  live in [tokens.css](src/styles/tokens.css). Re-skinning is a
  single-file change.

- **Type** — four families, each chosen for what it *signals*:
  - `--font-helvetica` — system Helvetica/Arial. The identity register:
    name, bio body, the email link in the footer.
  - `--font-nature` — Fraunces (variable, opsz + SOFT axes tuned). The
    scientist register: scientist-tagged item titles, the CV link.
  - `--font-terminal` — Menlo on Mac (real Apple Terminal default) with
    JetBrains Mono Variable as fallback. The developer register:
    developer-tagged item titles, the GitHub link.
  - `--font-tolkien` — Cormorant Garamond. The worldbuilder register:
    worldbuilder-tagged item titles, the whitewaterlegendlore link.

- **Universal sizing** — almost all text is at `--type-base`. The only
  hierarchical departures are the name, the Trajectory heading, and
  slightly-smaller metadata. Hierarchy is carried by *typeface choice*,
  not size. Filtering the page by role therefore changes the
  typographic register of what's visible — pick "Scientist" and the
  page becomes scholarly serif; pick "Developer" and it becomes
  Terminal mono.

- **Colors** — warm paper in light mode, warm ink in dark mode. A
  single terracotta accent, used only for active pips and link hover.
  Dark mode follows `prefers-color-scheme` by default; the footer
  toggle overrides and persists in `localStorage`.

- **Layout** — two columns inside a ~64rem page. Left ≈ 1/3
  (portrait + four contact links stacked) and main ≈ 2/3 (name,
  pips, bio, Trajectory, bottom band). Collapses to a single column
  under 48rem. Within each item, a 5-column sub-grid
  (date · sep · title · sep · roles) holds the row format together
  even when titles wrap.

- **Bio** — uniform Helvetica. Earlier iterations had inline links
  in each role's font; we pulled that back so the register-switching
  only happens via the pips, the Trajectory titles, and the sidebar.
  If you want it back, add `class="role-scientist"` etc. to a bio
  link and reintroduce the rule in [global.css](src/styles/global.css).

- **Filter** — three pips under the bio plus role tags on every item.
  Click anywhere to toggle; multi-select with OR semantics; URL
  mirrors state at `?filter=scientist,developer`. Everything is
  server-rendered; the script only sets `hidden` on items that don't
  match. With JS disabled the whole stream shows.

## LLM-readability

- All content is in the initial HTML.
- Semantic markup (`<article>`, `<time>`, `<nav>`).
- `/llms.txt` is generated dynamically from the collections —
  see [llms.txt.ts](src/pages/llms.txt.ts).
- Sitemap (`/sitemap-index.xml`) generated by `@astrojs/sitemap`.
- RSS feed at `/rss.xml`.
- OpenGraph and Twitter card metadata on every page.

## Deploy (Vercel)

The project is a static site by default — `npm run build` outputs `./dist`.

1. Push to GitHub.
2. Import the repo in Vercel.
3. Framework preset: **Astro** (auto-detected).
4. No env vars needed for the default build.
5. Set the production domain. Update `SITE` in
   [astro.config.mjs](astro.config.mjs) to match — this affects canonical
   URLs, sitemap, RSS, and OG.

For non-Vercel hosts, `dist/` is plain static files; any CDN works.

## Things to swap out

- `NAME`, `TITLE`, `DESCRIPTION`, `BIO_HTML` in
  [src/pages/index.astro](src/pages/index.astro). The bio is plain HTML
  with one rule: inline links should carry a `role-scientist`,
  `role-developer`, or `role-worldbuilder` class so they pick up the
  matching font.
- The footer props `email`, `cvHref`, `githubHref`, `wllHref` on the
  same page.
- The seed items in [src/content/garden/](src/content/garden/) — about
  half of them link to placeholder URLs that you'll want to fix.
- The seed essay in [src/content/writing/](src/content/writing/).
- `public/cv.pdf` — drop in your CV.
- `public/og-default.png` — 1200×630 OG image.
- `SITE` in [astro.config.mjs](astro.config.mjs).
- Favicon at [public/favicon.svg](public/favicon.svg).

## Notes

- No tracking, no analytics. Add `<script>` for Plausible or similar in
  [BaseLayout.astro](src/layouts/BaseLayout.astro) if you want it.
- The only JavaScript shipped is the filter script (~1 kB) and the
  theme toggle (~0.5 kB).
- Lighthouse 100/100/100/100 is achievable; if it slips, the usual
  suspect is the `og-default.png` not being optimized.
