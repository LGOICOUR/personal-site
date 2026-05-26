// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// Production origin. Used for sitemap, RSS, canonical URLs, OG.
const SITE = "https://luisgoicouria.com";

export default defineConfig({
  site: SITE,
  integrations: [mdx(), sitemap()],
  trailingSlash: "never",
  build: {
    format: "file",
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark-dimmed",
      },
      wrap: true,
    },
  },
  vite: {
    server: {
      // quieter dev server
      hmr: { overlay: true },
    },
  },
});
