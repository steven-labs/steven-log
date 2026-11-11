import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
export const collections = {
  posts: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
    schema: ({ image }) => z.object({
      title: z.string(), description: z.string(), date: z.coerce.date(),
      seoTitle: z.string().optional(), seoDescription: z.string().optional(),
      socialImage: image().optional(), socialImageAlt: z.string().optional(),
      updated: z.coerce.date().optional(),
      category: z.enum(['생각', '기술']), tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
  }),
};
