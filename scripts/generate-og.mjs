/**
 * Generate public/og-default.png — the 1200×630 social-preview image
 * referenced by BaseLayout's og:image / twitter:image meta tags.
 *
 * Run once whenever the bio copy or color tokens change:
 *   node scripts/generate-og.mjs
 *
 * Sharp handles the SVG → PNG rasterization. We use only fonts that
 * are reliably present on macOS (Helvetica + Menlo + Times) so we
 * don't have to embed font files into the SVG.
 */

import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const W = 1200;
const H = 630;

// Tokens lifted from src/styles/tokens.css (light mode).
const BG = "#faf8f2";
const TEXT = "#1b1a17";
const MUTED = "#6f6a5e";
const FAINT = "#9b9588";
const ACCENT = "#a04a26";
const RULE = "#c9c2b1";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>

  <!-- Name -->
  <text x="80" y="280"
        font-family="Helvetica, Arial, sans-serif"
        font-weight="700"
        font-size="118"
        fill="${TEXT}"
        letter-spacing="-2.5">Luis Goicouria</text>

  <!-- Role pips. We can't use the real role typefaces (Fraunces /
       Cormorant aren't system fonts), but we *can* differentiate
       them with generic family classes — librsvg picks reasonable
       substitutes: a serif for Scientist, monospace for Developer,
       italic serif for Worldbuilder. -->
  <g font-size="38" letter-spacing="0.5">
    <text x="80" y="365" fill="${MUTED}">
      <tspan font-family="Times, 'Times New Roman', serif">Scientist</tspan>
      <tspan font-family="Helvetica, Arial, sans-serif" fill="${FAINT}">  |  </tspan>
      <tspan font-family="Menlo, 'Courier New', monospace">Lead Developer</tspan>
      <tspan font-family="Helvetica, Arial, sans-serif" fill="${FAINT}">  |  </tspan>
      <tspan font-family="Times, 'Times New Roman', serif" font-style="italic">Worldbuilder</tspan>
    </text>
  </g>

  <!-- Hairline rule -->
  <line x1="80" y1="510" x2="1120" y2="510" stroke="${RULE}" stroke-width="1"/>

  <!-- Footer: domain (accent) + tagline -->
  <text x="80" y="560"
        font-family="Helvetica, Arial, sans-serif"
        font-weight="500"
        font-size="28"
        fill="${ACCENT}">luisgoicouria.com</text>

  <text x="1120" y="560"
        font-family="Helvetica, Arial, sans-serif"
        font-size="22"
        fill="${MUTED}"
        text-anchor="end">epilepsy modeling · SkyPorch · Whitewater Legend Lore</text>
</svg>
`.trim();

const out = new URL("../public/og-default.png", import.meta.url);

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(out.pathname);

console.log(`Wrote ${out.pathname}`);
