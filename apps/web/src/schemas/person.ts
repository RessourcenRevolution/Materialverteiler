import { z } from 'zod'

export const PersonSchema = z.object({
  name: z.string(),
  description: z.string(),
  photo: z.object({
    width: z.number(),
    height: z.number(),
    url: z.string(),
  }).nullable().optional(),
})
export type Person = z.infer<typeof PersonSchema>
