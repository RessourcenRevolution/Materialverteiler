import { z } from "zod";

export const TeamSchema = z.object({
  id: z.string(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  name: z.string().email(),
  address: z.string(),
  postalcode: z.string(),
  city: z.string(),
});
export type Team = z.infer<typeof TeamSchema>;
