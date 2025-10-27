import { fileURLToPath } from 'node:url'
import react from '@astrojs/react'
import solid from '@astrojs/solid-js'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'
import astrobook from 'astrobook'
import unocss from 'unocss/astro'

// https://astro.build/config
export default defineConfig({
  server: {
    port: 54321,
  },

  // Enable many frameworks to support all different kinds of components.
  integrations: [
    react({ include: ['**/react/*'], experimentalReactChildren: true }),
    solid({
      // Ensure Solid's JSX transform runs for our .solid.tsx stories and shared Solid TSX utilities
      include: [
        // Story files following .solid.tsx/.solid.ts conventions
        '**/*.solid.tsx',
        '**/*/*.solid.tsx',
        '**/*.solid.ts',
        '**/*/*.solid.ts',
        // Shared Solid components/utilities consumed by stories
        '**/shared/src/solid/**/*.{ts,tsx}',
        // 3rd-party Solid components
        '**/node_modules/@suid/material/**',
      ],
    }),
    svelte(),
    vue(),
    astrobook({
      directory: '../packages/components',
      title: 'Destyler UI',
      css: [
        './src/style/bootstrap.css',
        './src/style/reset.css',
      ],
    }),
  ],
})
