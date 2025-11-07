import { z } from "zod";
import { TeamSchema } from "./team";

export const UserSchema = z.object({
  id: z.string(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  email: z.string().email(),
  emailVisibility: z.boolean(),
  name: z.string(),
  verified: z.boolean(),
  team: z.string(),
  expand: z.object({ team: TeamSchema.optional() }).optional(),
  // avatar: '',
});
export type User = z.infer<typeof UserSchema>;
