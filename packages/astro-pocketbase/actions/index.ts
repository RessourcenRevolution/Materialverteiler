import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { ClientResponseError } from "pocketbase";

const required = {
  required_error: "required",
  invalid_type_error: "required",
};

export const login = defineAction({
  accept: "form",
  input: z.object({
    email: z.string(required),
    password: z.string(required),
  }),
  handler: async (input, { locals }) => {
    try {
      await locals.pb
        .collection("users")
        .authWithPassword(input.email, input.password);

      return {
        cookie: locals.pb.authStore.exportToCookie({
          secure: import.meta.env.DEV ? false : true,
        }),
      };
    } catch (e) {
      if (e instanceof ClientResponseError && e?.response?.status) {
        return new ActionError({
          code: "UNAUTHORIZED",
          message: "unauthorized",
        });
      } else {
        return new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "unknown_error",
        });
      }
    }
  },
});

export const signup = defineAction({
  accept: "form",
  input: z.object({
    name: z.string(required),
    email: z.string(required),
    password: z.string(required).min(8, 'password_too_short'),
  }),
  handler: async (input, { locals }) => {
    try {
      // Create user
      await locals.pb
        .collection("users")
        .create({
          name: input.name,
          email: input.email,
          password: input.password,
          passwordConfirm: input.password,
        });
      // Request verification
      await locals.pb.collection("users").requestVerification(input.email);
      // Login
      await locals.pb
        .collection("users")
        .authWithPassword(input.email, input.password);
      return {
        cookie: locals.pb.authStore.exportToCookie({
          secure: import.meta.env.DEV ? false : true,
        }),
      };
    } catch (e) {
      if (
        e instanceof ClientResponseError &&
        e?.response?.data?.email?.code === "validation_not_unique"
      ) {
        throw new ActionError({
          code: "NOT_ACCEPTABLE",
          message: "email_in_use",
        });
      } else if (
        e instanceof ClientResponseError &&
        e?.response?.data?.password?.code === "validation_min_text_constraint"
      ) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "password_invalid",
        });
      } else {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "unknown_error",
        });
      }
    }
  },
});
