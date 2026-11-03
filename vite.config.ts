import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/Test-library/' : '/',
  plugins: [react(), tailwindcss()],
  define: { __ARTIFACT__: 'false' },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        japanese: resolve(import.meta.dirname, 'japanese/index.html'),
      },
    },
  },
})
