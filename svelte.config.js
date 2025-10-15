import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  compilerOptions: {
    customElement: true,                 // <-- required for <svelte:options customElement="...">
    // optional, only if you still use `new App(...)` anywhere:
    // compatibility: { componentApi: 4 }
  }
};
