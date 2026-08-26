// vite.config.js
import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import path from "path"

export default defineConfig(({ mode }) => {
  // When we run: vite build --mode dev-bundle
  const isDevBundle = mode === "dev-bundle"

  return {
    plugins: [svelte()],
    resolve: {
      alias: {
        $lib: path.resolve("./src/lib/3D"),
      },
    },
    build: {
      lib: {
        // normal build uses src/main.js; dev bundle uses src/dev-main.js
        entry: isDevBundle ? "src/dev-main.js" : "src/main.js",

        //  global name for the IIFE bundle (same for both)
        name: "Widgets",

        // immediately invoked function expression (iife) - everything
        // wrapped in a function that runs immediately
        formats: ["iife"],

        // different filenames for prod v. dev bundle
        fileName: () => (isDevBundle ? "widgets-dev.js" : `widgets.js`),
      },
      rollupOptions: {
        // keep everything bundled
      },
    },
  }
})
