import { z } from 'zod'

export const GallerySchema = z.object({
  name: z.string(),
  title: z.string().optional(),
  items: z.array(z.object({
    title: z.string(),
    link: z.string(),
    image: z.object({
      width: z.number(),
      height: z.number(),
      url: z.string(),
    }).nullable().optional(),
  })),
})
export type Gallery = z.infer<typeof GallerySchema>
