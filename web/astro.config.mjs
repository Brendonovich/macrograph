import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";
import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";
import devtools from "solid-devtools/vite";

export default defineConfig({
  integrations: [solid(), tailwind()],
  output: "hybrid",
  adapter: vercel(),
  vite: {
    plugins: [
      devtools({
        /* features options - all disabled by default */
        autoname: true, // e.g. enable autoname
      }),
    ],
  },
});
