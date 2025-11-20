import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: 'src/index.ts',
      name: 'DrawerMenu',
      // the proper extensions will be added
    fileName: (format) => `drawer-menu.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      output: {
        dir: 'dist',
      },
    },
  },
})
