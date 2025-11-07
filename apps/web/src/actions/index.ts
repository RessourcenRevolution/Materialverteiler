import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { ClientResponseError } from "pocketbase";
import { defaultLang, ui, useTranslations } from "~/i18n/ui";

const required = {
  required_error:
    "forms.errors.required" satisfies keyof (typeof ui)[typeof defaultLang],
  invalid_type_error:
    "forms.errors.required" satisfies keyof (typeof ui)[typeof defaultLang],
};

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
  createListing: defineAction({
    accept: "form",
    input: z.object({
      title: z.string(required),
      description: z.string(required),
    }),
    handler: async (input, { locals }) => {
      const t = useTranslations();
      try {
        const listing = await locals.pb
          .collection("listings")
          .create({ ...input, user: locals.pb.authStore!.record!.id });
        return listing;
      } catch (error) {
        if (error instanceof ClientResponseError && error?.status === 403) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: t("create-listing.errors.forbidden"),
          });
        } else {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: t("create-listing.errors.unknown"),
          });
        }
      }
    },
  }),
  createTeam: defineAction({
    accept: "form",
    input: z.object({
      name: z.string(required),
      address: z.string(required),
      postalcode: z.string(required),
      city: z.string(required),
    }),
    handler: async (input, { locals }) => {
      const t = useTranslations();
      if (locals.pb.authStore.record?.team) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: t("team-form.errors.already-in-team"),
        });
      }
      try {
        const team = await locals.pb.collection("teams").create({ ...input });
        const user = await locals.pb
          .collection("users")
          .update(locals.pb.authStore.record!.id, { team: team.id });
        return team;
      } catch (error) {
        if (error instanceof ClientResponseError && error?.status === 403) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: t("create-listing.errors.forbidden"),
          });
        } else {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: t("create-listing.errors.unknown"),
          });
        }
      }
    },
  }),
};
