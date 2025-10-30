import { defineCollection, z } from "astro:content";
import type { OGPropsExtra } from "../types";

const blog = defineCollection({
  // Type-check frontmatter using a schema
  type: "content",
  schema: ({ image }) =>
    z.object({
      status: z.enum(["draft", "preview", "published"]),
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      updatedDate: z
        .string()
        .optional()
        .transform((str) => (str ? new Date(str) : undefined)),
      // heroImage: z.string().optional().or(image()),
      heroImage: image().optional().or(z.string().optional()),
      // extra is array of OGPropsExtra
      extra: z.array(z.custom<OGPropsExtra>((val) => val)).optional(),
    }),
});

export const collections = { blog };
