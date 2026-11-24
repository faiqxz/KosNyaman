import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // The build-time prerender bundle (scripts/prerender.mjs) inlines its
  // dependencies so Node never has to resolve ESM/CJS package quirks.
  ssr: { noExternal: true },
  build: {
    // Target modern browsers for smaller output
    target: 'es2020',
    // CSS minification
    cssMinify: 'lightningcss',
    // Lets the prerender script find each page's CSS/JS chunks
    manifest: !isSsrBuild,
    rollupOptions: isSsrBuild ? {} : {
      output: {
        manualChunks(id: string) {
          // Split vendor React into its own cached chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          // GSAP animation library
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';
          }
          // Icons library
          if (id.includes('node_modules/@phosphor-icons')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },
}))
