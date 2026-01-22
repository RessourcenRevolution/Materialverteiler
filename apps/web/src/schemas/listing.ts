import { z } from 'zod'
import { UserSchema } from './user'
import { TeamSchema } from './team'
import type { defaultLang, ui } from '~/i18n/ui'
import { AccountingSchema } from './accounting'

export const ListingSchema = z.object({
  id: z.string(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  user: z.string(),
  team: z.string(),
  title: z.string()
    .trim()
    .min(1, 'forms.errors.required' satisfies keyof (typeof ui)[typeof defaultLang]),
  start_date: z.coerce.date(),
  end_date: z.literal('').or(z.coerce.date()).optional(),
  description: z.string()
    .trim()
    .min(1, 'forms.errors.required' satisfies keyof (typeof ui)[typeof defaultLang]),
  material: z.string()
    .trim()
    .min(1, 'forms.errors.required' satisfies keyof (typeof ui)[typeof defaultLang]),
  measurements: z.string()
    .trim()
    .min(1, 'forms.errors.required' satisfies keyof (typeof ui)[typeof defaultLang]),
  condition: z.string()
    .trim()
    .min(1, 'forms.errors.required' satisfies keyof (typeof ui)[typeof defaultLang]),
  address: z.string()
    .trim()
    .min(1, 'forms.errors.required' satisfies keyof (typeof ui)[typeof defaultLang]),
  postalcode: z.string()
    .trim()
    .min(1, 'forms.errors.required' satisfies keyof (typeof ui)[typeof defaultLang])
    .regex(/^\d{5}$/, 'forms.errors.postalcode'),
  city: z.string()
    .trim()
    .min(1, 'forms.errors.required' satisfies keyof (typeof ui)[typeof defaultLang]),
  pickup_description: z.string().optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(['new', 'open', 'reserved', 'success', 'failure']),
  expand: z
    .object({
      user: UserSchema.optional(),
      team: TeamSchema.optional(),
      accounting_via_listing: z.array(AccountingSchema).optional(),
    })
    .optional(),
})
export type Listing = z.infer<typeof ListingSchema>
