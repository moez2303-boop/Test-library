import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Builds Kotoba Clips as one self-contained HTML file for a claude.ai Artifact.
// Grading there uses the viewer's Claude account instead of an API key.
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  define: { __ARTIFACT__: 'true' },
  build: {
    outDir: resolve(import.meta.dirname, 'dist-artifact'),
    emptyOutDir: true,
    rollupOptions: { input: resolve(import.meta.dirname, 'japanese/index.html') },
  },
})
