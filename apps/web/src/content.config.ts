// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content'

// 3. Import Zod
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

// 4. Define your collection(s)
const manual = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/manual' }),
  schema: z.object({
    title: z.string(),
  }),
})

// 5. Export a single `collections` object to register your collection(s)
export const collections = { manual }
