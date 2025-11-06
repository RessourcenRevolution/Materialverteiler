import { z } from "zod";
import { UserSchema, type User } from "./user";

export const ListingSchema = z.object({
  id: z.string(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  title: z.string(),
  description: z.string(),
  user: z.string(),
  expand: z.object({
    user: UserSchema,
  }),
});
export type Listing = z.infer<typeof ListingSchema>;
