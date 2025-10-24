// @ts-check
import path from "node:path";
import { defineConfig } from "astro/config";
import astrobook from "astrobook";

import node from "@astrojs/node";

import tailwindcss from "@tailwindcss/vite";

console.log(path.resolve("../packages/ui"));

// https://astro.build/config
export default defineConfig({
  server: {
    port: 3001,
  },

  adapter: node({
    mode: "standalone",
  }),

  integrations: [
    astrobook({
      subpath: "/",
      directory: path.resolve("../../packages/ui"),
      css: ["./src/styles/global.css"],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
