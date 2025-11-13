import { z } from "zod";
import { UserSchema } from "./user";

export const ListingSchema = z.object({
  id: z.string(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  title: z.string(),
  description: z.string(),
  user: z.string(),
  images: z.array(z.string()),
  expand: z
    .object({
      user: UserSchema.optional(),
    })
    .optional(),
});
export type Listing = z.infer<typeof ListingSchema>;
