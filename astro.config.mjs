import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  compressHTML: false,
  integrations: [tailwind()],
  output: "static",
  base: '/tic-tac-toe-nxn',
  outDir: "docs",
  trailingSlash: "never",
  server: {
    host: true
  },
  vite: {
    build: {
      sourcemap: true,
    },
    worker: {
      format: 'es',
    },
  },
});