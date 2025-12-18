import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { ClientResponseError } from 'pocketbase'
import { defaultLang, ui, useTranslations } from '~/i18n/ui'
import { login } from '@rr/astro-pocketbase/actions'
import { ListingSchema, type Listing } from '~/schemas/listing'
import { UserSchema } from '~/schemas/user'

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
      firstname: z.string(required)
        .trim()
        .min(1, 'forms.errors.required' satisfies keyof (typeof ui)[typeof defaultLang]),
      lastname: z.string(required)
        .trim()
        .min(1, 'forms.errors.required' satisfies keyof (typeof ui)[typeof defaultLang]),
      team: z.string(required)
        .trim()
        .min(1, 'forms.errors.required' satisfies keyof (typeof ui)[typeof defaultLang]),
      email: z.string(required),
      password: z.string(required).min(8, 'password_too_short'),
      message: z.string(required)
        .trim()
        .min(1, 'forms.errors.required' satisfies keyof (typeof ui)[typeof defaultLang]),
      terms: z.boolean(required),
    }),
    handler: async (input, { locals }) => {
      try {
        let time = performance.now()
        // Create user
        const user = await locals.pb.collection('users').create({
          firstname: input.firstname,
          lastname: input.lastname,
          email: input.email,
          password: input.password,
          passwordConfirm: input.password,
          terms: input.terms,
        })
        console.log(`collection('users').create took ${performance.now() - time} milliseconds`)
        time = performance.now()
        // Login
        await locals.pb
          .collection('users')
          .authWithPassword(input.email, input.password)
        console.log(`authWithPassword() took ${performance.now() - time} milliseconds`)
        time = performance.now()
        // Create team
        const team = await locals.pb
          .collection('teams')
          .create({ name: input.team })
        console.log(`collection('teams').create took ${performance.now() - time} milliseconds`)
        time = performance.now()
        // Update user
        await locals.pb.collection('users').update(user.id, { team: team.id })
        console.log(`collection('users').update took ${performance.now() - time} milliseconds`)
        time = performance.now()
        // Request verification
        await locals.pb.collection('users').requestVerification(input.email)
        console.log(`collection('users').requestVerification took ${performance.now() - time} milliseconds`)
        time = performance.now()
        // Notify managers
        await locals.pb.send(`/api/users/${user.id}/notify-managers`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: input.message,
            }),
          })
        console.log(`POST notify-managers took ${performance.now() - time} milliseconds`)
        time = performance.now()
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

  user: defineAction({
    accept: 'form',
    input: UserSchema.pick({ notifications: true }),
    handler: async (input, { locals }) => {
      const t = useTranslations()
      if (!locals.pb.authStore.record?.id) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'unauthorized_user',
        })
      }
      try {
        return locals.pb.collection('users').update(locals.pb.authStore.record.id, input)
      }
      catch {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: t('create-listing.errors.unknown'),
        })
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
      ListingSchema.omit({ id: true, user: true, team: true, images: true, status: true }).extend({
        'type': z.literal('create'),
        'images+': z.array(z.instanceof(File)).optional(),
      }),
      ListingSchema.omit({ user: true, team: true }).extend({
        'type': z.literal('update'),
        'images+': z.array(z.instanceof(File)).optional(),
      }),
    ]),
    handler: async (input, { locals }) => {
      const t = useTranslations()
      try {
        let listing
        let status

        if (input.type === 'create') {
          status = 'created'
          listing = await locals.pb.collection('listings').create({
            ...input,
            status: 'new',
            user: locals.pb.authStore!.record!.id,
            team: locals.pb.authStore!.record!.team,
          }) as Listing
        }
        else {
          status = 'updated'
          const { id: _id, ...data } = input
          listing = await locals.pb.collection('listings').update(input.id, {
            ...data,
          }) as Listing
        }
        return { listing, status }
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

  /**
   * Remove a listing
   */
  removeListing: defineAction({
    accept: 'form',
    input: z.object({
      id: z.string(),
    }),
    handler: async (input, { locals }) => {
      const t = useTranslations()
      try {
        await locals.pb.collection('listings').update(input.id, { deleted: new Date() })
        return { success: true }
      }
      catch (error) {
        console.error(error)
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: t('forms.errors.unknown'),
        })
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
