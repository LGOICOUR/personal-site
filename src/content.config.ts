import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const ROLES = ["scientist", "developer", "worldbuilder"] as const;
export type Role = (typeof ROLES)[number];

/**
 * The "garden" — a reverse-chronological stream of items.
 * Each item is one of: project, paper, talk, essay link, reading list, note.
 * Items may link to an external URL OR to an internal essay (via internalSlug).
 */
const garden = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/garden",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    roles: z.array(z.enum(ROLES)).min(1),
    date: z.coerce.date(),
    link: z.string().url().optional(),
    internalSlug: z.string().optional(),
    thumbnail: z.string().optional(),
    featured: z.boolean().optional().default(false),
    draft: z.boolean().optional().default(false),
  }),
});

/**
 * Long-form essays rendered at /writing/<slug>.
 * The slug is taken from the file name.
 */
const writing = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/writing",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    roles: z.array(z.enum(ROLES)).optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { garden, writing };
