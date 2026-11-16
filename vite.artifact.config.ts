import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Builds one app as a self-contained HTML file for a claude.ai Artifact.
// ARTIFACT_APP picks the app: "japanese" (Kotoba Clips, the default) or "french" (Allons-y).
// In the Artifact build, pages use the viewer's claude.ai capabilities instead of API keys,
// the microphone or file downloads.
const app = process.env.ARTIFACT_APP ?? 'japanese'

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  define: { __ARTIFACT__: 'true' },
  build: {
    outDir: resolve(import.meta.dirname, 'dist-artifact'),
    emptyOutDir: true,
    rollupOptions: { input: resolve(import.meta.dirname, `${app}/index.html`) },
  },
})
