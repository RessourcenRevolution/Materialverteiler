import { z } from 'zod'

export const TeamTypeEnum = (message?: string) => z.enum(['public', 'non-profit', 'commercial'], { message })

export const TeamSchema = z.object({
  id: z.string(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  name: z.string(),
  type: TeamTypeEnum(),
  city: z.string(),
  address: z.string().optional(),
  postalcode: z.string().optional(),
})
export type Team = z.infer<typeof TeamSchema>
