import { z } from 'zod'

export const TeamSchema = z.object({
  id: z.string(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  name: z.string(),
  address: z.string().optional(),
  postalcode: z.string().optional(),
  city: z.string().optional(),
})
export type Team = z.infer<typeof TeamSchema>
