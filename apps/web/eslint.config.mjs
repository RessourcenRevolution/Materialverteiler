// eslint.config.js
import { defineConfig } from 'eslint/config'
import eslintPluginAstro from 'eslint-plugin-astro'
import config from '@rr/eslint-config'

export default defineConfig([
  {
    extends: [config],
  },
  ...eslintPluginAstro.configs.recommended,
])
