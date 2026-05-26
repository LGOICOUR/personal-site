import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

/**
 * Combined RSS feed of garden items + long-form essays.
 * Sorted by date, newest first.
 */
export async function GET(context: APIContext) {
  const garden = await getCollection(
    "garden",
    ({ data }) => !data.draft
  );
  const writing = await getCollection(
    "writing",
    ({ data }) => !data.draft
  );

  const gardenItems = garden.map((i) => ({
    title: i.data.title,
    pubDate: i.data.date,
    description: i.data.description,
    link: i.data.link
      ? i.data.link
      : i.data.internalSlug
        ? `/writing/${i.data.internalSlug}`
        : "/",
    categories: i.data.roles,
  }));

  const essayItems = writing.map((e) => ({
    title: e.data.title,
    pubDate: e.data.date,
    description: e.data.description,
    link: `/writing/${e.id}`,
    categories: e.data.roles ?? [],
  }));

  const items = [...gardenItems, ...essayItems].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime()
  );

  return rss({
    title: "Luis Goicouria — Garden",
    description:
      "Projects, essays, notes, and reading on neuroscience, software, and AI safety.",
    site: context.site!,
    items,
    customData: `<language>en-us</language>`,
  });
}
