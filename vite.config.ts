import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Three.js + postprocessing are ~800KB combined — split from app code
            'three-vendor': ['three', 'postprocessing'],
            // GSAP split out so it doesn't block initial React hydration
            'gsap-vendor': ['gsap'],
            // Motion split — large but needed early for Hero animations
            'motion-vendor': ['motion'],
            // React core cached independently by the browser
            'react-vendor': ['react', 'react-dom'],
          },
        },
      },
    },
  };
});
