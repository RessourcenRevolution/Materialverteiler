import { z } from 'zod'

export const PageSchema = z.object({
  title: z.string(),
  path: z.string().optional(),
  access: z.enum(['public', 'authenticated']),
  content: z.object({
    document: z.any(),
  }),
})
export type Page = z.infer<typeof PageSchema>
