import { defineConfig } from 'astro/config'
import deno from '@astrojs/deno'
import mdx from '@astrojs/mdx'
import prefetch from '@astrojs/prefetch'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  site: 'https://deno-astro-example.deno.dev',
  integrations: [mdx(), prefetch(), react(), tailwind()],
  output: 'server',
  adapter: deno()
})
