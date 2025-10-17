// vite.config.js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'Widgets',
      formats: ['iife'],
      fileName: () => `widgets.js`
    },
    rollupOptions: {
      // keep everything bundled
    }
  }
});
