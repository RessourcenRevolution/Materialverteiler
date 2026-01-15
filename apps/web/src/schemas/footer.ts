import { z } from 'zod'

export const FooterSchema = z.object({
  content: z.object({
    document: z.any(),
  }),
  links: z.array(z.object({
    icon: z.string().optional().nullable(),
    title: z.string(),
    path: z.string(),
  })),
})
export type Footer = z.infer<typeof FooterSchema>
