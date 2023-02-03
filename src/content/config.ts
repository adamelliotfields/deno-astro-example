import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  // type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z
      .string()
      .or(z.date())
      .optional(),
    updateDate: z
      .string()
      .or(z.date())
      .optional(),
    heroImage: z.string().optional()
  })
})

export const collections = { blog }
