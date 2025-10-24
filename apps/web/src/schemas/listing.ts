import { z } from "zod";

export const ListingSchema = z.object({
  id: z.string(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  title: z.string(),
  description: z.string(),
});
export type Listing = z.infer<typeof ListingSchema>;
