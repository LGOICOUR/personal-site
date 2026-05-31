import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

/**
 * /llms.txt — per llmstxt.org, a single Markdown file an LLM can read
 * to understand what this site is and where the most important content
 * lives. Built dynamically from content collections so it stays fresh.
 *
 * The static prose (blockquote + About) should match the bio prose on
 * the landing page. If you change one, change the other.
 */
export const GET: APIRoute = async ({ site }) => {
  const origin = site?.toString().replace(/\/$/, "") ?? "";

  const garden = (
    await getCollection("garden", ({ data }) => !data.draft)
  ).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const writing = (
    await getCollection("writing", ({ data }) => !data.draft)
  ).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  // Match the visible labels on the landing page exactly. If you
  // rename a role on the site (Pips.astro / GardenItem.astro), rename
  // it here too.
  const ROLE_LABEL: Record<string, string> = {
    scientist: "Scientist",
    developer: "Lead Developer",
    worldbuilder: "Worldbuilder",
  };
  const labelRoles = (rs: readonly string[]) =>
    rs.map((r) => ROLE_LABEL[r] ?? r).join(", ");

  const fmtItem = (i: (typeof garden)[number]) => {
    const url = i.data.link
      ? i.data.link
      : i.data.internalSlug
        ? `${origin}/writing/${i.data.internalSlug}`
        : "";
    return `- [${i.data.title}](${url}) — ${i.data.description} _(${labelRoles(i.data.roles)})_`;
  };

  const fmtEssay = (e: (typeof writing)[number]) =>
    `- [${e.data.title}](${origin}/writing/${e.id}) — ${e.data.description}`;

  const writingSection =
    writing.length > 0
      ? `\n## Long-form writing\n\n${writing.map(fmtEssay).join("\n")}\n`
      : "";

  const body = `# Luis Goicouria

> PhD in disease modeling and mechanism in focal epilepsy. Currently a
> developer at SkyPorch, where the team launched the health and
> wellness app Attached and was invited to Apple HQ for SpatialCut, a
> visionOS-native spatial video editor. Side practice: homebrew
> Dungeons & Dragons modules and assets under Whitewater Legend Lore.
> This site is a digital garden organized by three roles: scientist,
> developer, worldbuilder.

## About

- Background: PhD in focal epilepsy disease modeling (Brown University,
  2023). Undergraduate at Washington University in St. Louis.
- Day job: software developer / partner at SkyPorch — Vision Pro apps
  (SpatialCut, Energy Atlas, Plant Shop by Tula House) and the
  React Native consumer app Attached.
- Side practice: tabletop game design as **Whitewater Legend Lore** —
  homebrew D&D modules at whitewaterlegendlore.wordpress.com and
  assets at whitewaterlegendlore.itch.io.
- Location: Oakland, CA.
- Contact: luis.goicouria@gmail.com
- CV: ${origin}/cv.pdf
- GitHub: https://github.com/LGOICOUR

## Trajectory

${garden.map(fmtItem).join("\n")}
${writingSection}
## Feeds and indexes

- [RSS feed](${origin}/rss.xml)
- [Sitemap](${origin}/sitemap-index.xml)
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
