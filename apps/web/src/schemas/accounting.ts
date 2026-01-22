import { z } from 'zod'

export const AccountingSchema = z.object({
  id: z.string(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  listing: z.string(),
  excel_file: z.string().optional(),
  co2: z.number(),
})
export type Accounting = z.infer<typeof AccountingSchema>
