import { ActionError, defineAction } from "astro:actions";

export const server = {
  sendEmailVerification: defineAction({
    accept: "form",
    handler: async (_input, { locals }) => {
      if (!locals.pb.authStore.record) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "User must be logged in.",
        });
      }
      return locals.pb
        .collection("users")
        .requestVerification(locals.pb.authStore.record.email);
    },
  }),
};
