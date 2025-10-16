import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [svelte()],
  server: { open: '/index.html' },
  build: {
    target: 'es2017',
    rollupOptions: {
      input: {
        'x-demo-button': resolve(__dirname, 'src/widgets/demo-button/ce.js'),
        'x-callout':     resolve(__dirname, 'src/widgets/callout/App.svelte'),
        'x-credits-accordion': resolve(__dirname, 'src/widgets/credits-accordion/CreditsAccordion.svelte')
      },
      output: {
        format: 'es',
        entryFileNames: '[name].v1.0.0.js',
      }
    }
  }
});
