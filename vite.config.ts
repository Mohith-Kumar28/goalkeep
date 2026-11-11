import { defineConfig } from "vite"
import { cloudflare } from "@cloudflare/vite-plugin"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    // The Cloudflare plugin builds the SSR environment for the Workers
    // runtime, so it has to come before tanstackStart.
    cloudflare({
      viteEnvironment: { name: "ssr" },
      // `pnpm deploy:production` builds against wrangler.production.jsonc
      // (goalkeep.org); everything else targets the goalkeep-v5 preview.
      configPath: process.env.WRANGLER_CONFIG ?? "wrangler.jsonc",
    }),
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
