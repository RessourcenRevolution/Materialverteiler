import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { ClientResponseError } from 'pocketbase'
import { defaultLang, ui, useTranslations } from '~/i18n/ui'
import { login } from '@rr/astro-pocketbase/actions'
import { ListingSchema } from '~/schemas/listing'

const required = {
  required_error:
    'forms.errors.required' satisfies keyof (typeof ui)[typeof defaultLang],
  invalid_type_error:
    'forms.errors.required' satisfies keyof (typeof ui)[typeof defaultLang],
}

export const server = {
  // Pocketbase
  login,

  /**
   * Create user and team
   */
  signup: defineAction({
    accept: 'form',
    input: z.object({
      firstname: z.string(required),
      lastname: z.string(required),
      team: z.string(required),
      email: z.string(required),
      password: z.string(required).min(8, 'password_too_short'),
    }),
    handler: async (input, { locals }) => {
      try {
        // Create user
        const user = await locals.pb.collection('users').create({
          firstname: input.firstname,
          lastname: input.lastname,
          email: input.email,
          password: input.password,
          passwordConfirm: input.password,
        })
        // Login
        await locals.pb
          .collection('users')
          .authWithPassword(input.email, input.password)
        // Create team
        const team = await locals.pb
          .collection('teams')
          .create({ name: input.team })
        // Update user
        await locals.pb.collection('users').update(user.id, { team: team.id })
        // Request verification
        await locals.pb.collection('users').requestVerification(input.email)
        return {
          cookie: locals.pb.authStore.exportToCookie({
            secure: import.meta.env.DEV ? false : true,
          }),
        }
      }
      catch (e) {
        if (
          e instanceof ClientResponseError
          && e?.response?.data?.email?.code === 'validation_not_unique'
        ) {
          throw new ActionError({
            code: 'NOT_ACCEPTABLE',
            message: 'email_in_use',
          })
        }
        else if (
          e instanceof ClientResponseError
          && e?.response?.data?.password?.code === 'validation_min_text_constraint'
        ) {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'password_invalid',
          })
        }
        else {
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'unknown_error',
          })
        }
      }
    },
  }),

  /**
   * Send an email verification email to the user.
   */
  sendEmailVerification: defineAction({
    accept: 'form',
    handler: async (_input, { locals }) => {
      if (!locals.pb.authStore.record) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'User must be logged in.',
        })
      }
      return locals.pb
        .collection('users')
        .requestVerification(locals.pb.authStore.record.email)
    },
  }),

  /**
   * Create a new listing
   */
  listing: defineAction({
    accept: 'form',
    input: z.discriminatedUnion('type', [
      ListingSchema.omit({ id: true, user: true, team: true, images: true }).extend({
        'type': z.literal('create'),
        'images+': z.array(z.instanceof(File)).optional(),
      }),
      ListingSchema.omit({ user: true, team: true, images: true }).extend({
        'type': z.literal('update'),
        'images+': z.array(z.instanceof(File)).optional(),
      }),
    ]),
    handler: async (input, { locals }) => {
      const t = useTranslations()
      try {
        let listing

        if (input.type === 'create') {
          listing = await locals.pb.collection('listings').create({
            ...input,
            user: locals.pb.authStore!.record!.id,
            team: locals.pb.authStore!.record!.team,
          })
        }
        else {
          const { id, ...data } = input
          listing = await locals.pb.collection('listings').update(input.id, {
            ...data,
          })
        }
        return listing
      }
      catch (error) {
        if (error instanceof ClientResponseError && error?.status === 403) {
          throw new ActionError({
            code: 'FORBIDDEN',
            message: t('create-listing.errors.forbidden'),
          })
        }
        else if (
          error instanceof ClientResponseError
          && error?.response?.data?.images?.code === 'validation_file_size_limit'
        ) {
          throw new ActionError({
            code: 'FORBIDDEN',
            message: t('create-listing.errors.image-file-size-limit'),
          })
        }
        else {
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: t('create-listing.errors.unknown'),
          })
        }
      }
    },
  }),
  createTeam: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string(required),
      address: z.string(required),
      postalcode: z.string(required),
      city: z.string(required),
    }),
    handler: async (input, { locals }) => {
      const t = useTranslations()
      if (locals.pb.authStore.record?.team) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message: t('team-form.errors.already-in-team'),
        })
      }
      try {
        const team = await locals.pb.collection('teams').create({ ...input })
        await locals.pb
          .collection('users')
          .update(locals.pb.authStore.record!.id, { team: team.id })
        return team
      }
      catch (error) {
        if (error instanceof ClientResponseError && error?.status === 403) {
          throw new ActionError({
            code: 'FORBIDDEN',
            message: t('create-listing.errors.forbidden'),
          })
        }
        else {
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: t('create-listing.errors.unknown'),
          })
        }
      }
    },
  }),

  contactListing: defineAction({
    accept: 'form',
    input: z.object({
      listing: z.string(required),
      name: z.string(required),
      email: z.string(required),
      phonenumber: z.string(required).optional(),
      message: z.string(required),
    }),
    handler: async (input, { locals }) => {
      try {
        await locals.pb.send(`/api/listings/${input.listing}/contact`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: input.name,
              email: input.email,
              phonenumber: input.phonenumber,
              message: input.message,
            }),
          })

        return {
          success: true,
        }
      }
      catch (e) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'error',
        })
      }
    },
  }),
}
