import { z } from 'zod'

export const NavigationSchema = z.object({
  name: z.enum(['main', 'meta']),
  items: z.array(z.object({
    icon: z.string().optional().nullable(),
    title: z.string(),
    path: z.string(),
  })),
})
export type Navigation = z.infer<typeof NavigationSchema>
