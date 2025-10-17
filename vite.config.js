// vite.config.js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'Callout',
      // produce an immediately-usable script
      formats: ['iife'],        // also add 'es' if you want a module build
      fileName: () => `callout.js`
    },
    rollupOptions: {
      // no external deps — bundle everything
    }
  }
});
