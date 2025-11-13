// @ts-check
import { defineConfig, envField } from "astro/config";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
// @ts-ignore
import lit from "@semantic-ui/astro-lit";

// https://astro.build/config
export default defineConfig({
  server: {
    port: Number(process.env.APP_PORT) || 3000,
  },

  adapter: node({
    mode: "standalone",
  }),

  env: {
    schema: {
      APP_NAME: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
      APP_LANGUAGE: envField.enum({
        values: ["en", "de"],
        context: "client",
        access: "public",
        optional: false,
      }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [lit()],
});
