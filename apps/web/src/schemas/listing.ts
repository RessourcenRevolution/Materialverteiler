import { z } from 'zod'
import { UserSchema } from './user'
import { TeamSchema } from './team'

export const ListingSchema = z.object({
  id: z.string(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  user: z.string(),
  team: z.string(),
  title: z.string(),
  start_date: z.coerce.date(),
  end_date: z.literal('').or(z.coerce.date()).optional(),
  description: z.string().optional(),
  material: z.string().optional(),
  measurements: z.string().optional(),
  condition: z.string().optional(),
  address: z.string().optional(),
  postalcode: z.string().optional(),
  city: z.string().optional(),
  pickup_description: z.string().optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(['new', 'open', 'reserved', 'success', 'failure']),
  expand: z
    .object({
      user: UserSchema.optional(),
      team: TeamSchema.optional(),
    })
    .optional(),
})
export type Listing = z.infer<typeof ListingSchema>
