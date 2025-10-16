import { fileURLToPath } from 'node:url'
import react from '@astrojs/react'
import solid from '@astrojs/solid-js'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'
import astrobook from 'astrobook'

const storybookRoot = new URL('./', import.meta.url)
const componentsDocsDir = new URL('../packages/components/', import.meta.url)

// https://astro.build/config
export default defineConfig({
  server: {
    port: 54321,
  },

  // Enable many frameworks to support all different kinds of components.
  integrations: [
    react({ include: ['**/react/*'], experimentalReactChildren: true }),
    solid({ include: ['**/solid/*'] }),
    svelte(),
    vue(),
    astrobook({ directory: '../packages/components/**/storybook/' }),
  ],
  vite: {
    server: {
      fs: {
        allow: [
          fileURLToPath(storybookRoot),
          fileURLToPath(componentsDocsDir),
        ],
      },
    },
    resolve: {
      alias: [
        { find: '@component', replacement: fileURLToPath(componentsDocsDir) },
      ],
    },
  },
})
