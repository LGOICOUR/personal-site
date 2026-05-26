# Getting luisgoicouria.com live

A six-phase checklist. Items marked **[must]** block launch;
**[should]** are pre-launch polish; **[nice]** are post-launch.

---

## 1. Pre-flight (in the repo)

- [ ] **[must]** Update `SITE` in
      [astro.config.mjs](astro.config.mjs) from
      `https://goicouria.com` to **`https://luisgoicouria.com`**.
      This drives canonical URLs, sitemap, RSS, and OG meta.
- [ ] **[must]** Confirm `astro build` completes clean
      from a fresh clone:
      `rm -rf node_modules dist .astro && npm install && npm run build`.
- [ ] **[should]** Add an Open Graph image at
      `public/og-default.png` (1200×630 PNG, ~< 300 KB). Without
      one, link previews on Twitter/LinkedIn/Slack render text-only.
      Suggested content: name + role pips + url, on warm-paper bg.
- [ ] **[should]** Compress `public/portrait.jpg` — it's currently
      ~750 KB. Target ~150-250 KB. ImageOptim (Mac) or
      `cwebp portrait.jpg -o portrait.webp` works; remember to
      update the `<img src>` in
      [Sidebar.astro](src/components/Sidebar.astro) if you switch
      to WebP.
- [ ] **[should]** Final read-through of bio + Trajectory copy.
- [ ] **[nice]** Replace `public/favicon.svg` with something more
      identity-forward than the generic `g` placeholder.

## 2. Git + GitHub

- [ ] **[must]** Initialize a repo:
      ```
      cd ~/Desktop/site
      git init
      git add .
      git commit -m "Initial site"
      ```
- [ ] **[must]** Create a new GitHub repo
      (https://github.com/new). Public or private — either works
      with Vercel. Suggested name: `luisgoicouria-site` or `site`.
- [ ] **[must]** Push:
      ```
      git remote add origin git@github.com:LGOICOUR/<repo-name>.git
      git branch -M main
      git push -u origin main
      ```

## 3. Vercel deploy

- [ ] **[must]** Sign in to https://vercel.com with your GitHub
      account.
- [ ] **[must]** New Project → Import the GitHub repo. Vercel
      auto-detects Astro. Defaults are correct:
      - Framework Preset: **Astro**
      - Build Command: `npm run build`
      - Output Directory: `dist`
      - Install Command: `npm install`
- [ ] **[must]** Click Deploy. First deploy takes ~30s.
- [ ] **[must]** Open the `*.vercel.app` URL Vercel gives you and
      smoke-test: bio reads, Trajectory items render, pips
      filter, theme toggles, CV link opens.

## 4. Domain

This is where most launches stumble. Don't rush DNS.

- [ ] **[must]** Confirm you own `luisgoicouria.com` — if not yet,
      buy at Cloudflare Registrar (cheapest), Porkbun, or
      Namecheap. ~$10–15/year.
- [ ] **[must]** In Vercel: Project → Settings → Domains → Add
      `luisgoicouria.com` **and** `www.luisgoicouria.com`. Vercel
      will show you the DNS records to add.
- [ ] **[must]** At your registrar, add the records Vercel shows.
      Two common shapes:
      - **Apex + www (most common):**
        - `A` record: `@` → `76.76.21.21`
        - `CNAME` record: `www` → `cname.vercel-dns.com`
      - **Cloudflare nameservers (alternative):** point the
        domain's nameservers to Cloudflare and proxy through them
        — gives extra DDoS protection but adds a moving part.
- [ ] **[must]** Wait for DNS propagation. Usually 5–30 min,
      sometimes a couple hours. Check with
      `dig luisgoicouria.com +short` or whatsmydns.net.
- [ ] **[must]** Vercel auto-issues a Let's Encrypt SSL cert once
      DNS resolves. Verify
      `https://luisgoicouria.com` returns the site with a green
      lock.
- [ ] **[should]** Decide on a canonical: typically redirect
      `www.luisgoicouria.com` → `luisgoicouria.com` (Vercel
      Project → Settings → Domains has a one-click toggle for
      this).

## 5. Post-deploy QA

Do this against the real production URL, not the preview.

- [ ] Each Trajectory link opens the right destination in a new
      tab.
- [ ] Each sidebar link works (email composes, CV opens PDF,
      github + whitewaterlegendlore reach the right pages).
- [ ] Pips: click `Scientist` → only scientist items remain;
      multi-select adds; URL updates to `?filter=…`; reload
      preserves filter.
- [ ] Theme toggle flips light/dark and persists across reload.
- [ ] Resize to mobile width — layout collapses cleanly, photo
      caps at ~16rem.
- [ ] View source on `/`: `<title>`, `<meta name="description">`,
      og:image, twitter:card all present.
- [ ] `/rss.xml` returns valid XML with your items.
- [ ] `/llms.txt` returns the Markdown summary with current
      Trajectory.
- [ ] `/sitemap-index.xml` returns sitemap.
- [ ] `/cv.pdf` downloads correctly.
- [ ] Run a Lighthouse audit (Chrome DevTools → Lighthouse,
      Mobile). Aim for 100s on Performance, Accessibility, Best
      Practices, SEO. If any score drops, the usual suspect is the
      portrait JPG size (see Phase 1).

## 6. After launch

- [ ] **[nice]** Add lightweight analytics. Plausible (paid) or
      Fathom (paid) or Vercel Web Analytics (free, basic). Drop
      the snippet in
      [BaseLayout.astro](src/layouts/BaseLayout.astro) before
      `</head>`.
- [ ] **[nice]** Submit `https://luisgoicouria.com/sitemap-index.xml`
      to Google Search Console.
- [ ] **[nice]** Update the email signatures, LinkedIn, Twitter
      bio, GitHub profile to point at the site.
- [ ] **[nice]** Add a CHANGELOG entry or git-tag for the launch
      so you can find the launch state later.

---

## Troubleshooting

**"Vercel deployed but the site is blank / 404s everywhere."**
Almost always caused by `SITE` in `astro.config.mjs` being wrong.
Fix it, commit, push — Vercel auto-redeploys.

**"DNS isn't propagating after an hour."**
Double-check the records at the registrar match Vercel's exactly
(no trailing dots, correct record type). `dig` against
`1.1.1.1` (Cloudflare DNS) and `8.8.8.8` (Google) to see if
they've picked up the change.

**"OG preview shows a 404 image."**
You haven't added `public/og-default.png` yet. Either add one or
remove the `og:image` meta tag from
[BaseLayout.astro](src/layouts/BaseLayout.astro).

**"Photo loads slowly on mobile."**
The placeholder JPG is 767 KB. Compress it (Phase 1).
