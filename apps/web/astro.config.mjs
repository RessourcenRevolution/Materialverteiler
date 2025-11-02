// @ts-check
import { defineConfig, envField } from "astro/config";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
// @ts-ignore
import lit from "@semantic-ui/astro-lit";

// https://astro.build/config
export default defineConfig({
  server: {
    port: 3000,
  },

  adapter: node({
    mode: "standalone",
  }),

  env: {
    schema: {
      API_URL: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
      PUBLIC_API_URL: envField.string({
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
