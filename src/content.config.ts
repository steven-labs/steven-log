import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
export const collections = {
  posts: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
    schema: z.object({
      title: z.string(), description: z.string(), date: z.coerce.date(),
      category: z.enum(['생각', '기술']), tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
  }),
};
