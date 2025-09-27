// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },

  integrations: [react()],

  i18n: {
    defaultLocale: "es",
    locales: ["es", "en", "zh"],
    fallback: { en: "es", zh: "en" },
    routing: { prefixDefaultLocale: true },
  },
});
