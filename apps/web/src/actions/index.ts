import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { ClientResponseError } from "pocketbase";
import { useTranslations } from "~/i18n/ui";

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
      title: z.string(),
      description: z.string(),
    }),
    handler: async (input, { locals }) => {
      const t = useTranslations();
      try {
        const listing = await locals.pb
          .collection("listings")
          .create({ ...input, user: locals.pb.authStore!.record!.id });
        console.log(listing);
        return listing;
      } catch (error) {
        if (error instanceof ClientResponseError && error?.status === 403) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: t("new-listing.errors.forbidden"),
          });
        } else {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: t("new-listing.errors.unknown"),
          });
        }
      }
    },
  }),
};
