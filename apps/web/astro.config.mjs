// @ts-check
import { defineConfig, envField } from 'astro/config'
import node from '@astrojs/node'
import tailwindcss from '@tailwindcss/vite'
// @ts-expect-error Lit has no types
import lit from '@semantic-ui/astro-lit'

// https://astro.build/confi
export default defineConfig({
  server: {
    port: Number(process.env.APP_PORT) || 3000,
  },

  security: {
    checkOrigin: true,
    allowedDomains: [{ hostname: process.env.APP_HOST }],
  },

  adapter: node({
    mode: 'standalone',
  }),

  env: {
    schema: {
      APP_NAME: envField.string({
        context: 'client',
        access: 'public',
        optional: false,
      }),
      APP_LANGUAGE: envField.enum({
        values: ['en', 'de'],
        context: 'client',
        access: 'public',
        optional: false,
      }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [lit()],
})
