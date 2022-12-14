import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'

import svelte from '@astrojs/svelte'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  server: { port: 8787 },
  site: 'https://edgeflix.based.zone',
  adapter: cloudflare({ mode: 'directory' }),
  integrations: [svelte()]

})
