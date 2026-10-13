import { fileURLToPath } from 'node:url'
import react from '@astrojs/react'
import solid from '@astrojs/solid-js'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'
import decorators from '@babel/plugin-proposal-decorators'
import classProperties from '@babel/plugin-transform-class-properties'
import classStaticBlock from '@babel/plugin-transform-class-static-block'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'astro/config'
import astrobook from 'astrobook'

// https://astro.build/config
export default defineConfig({
  // Preserve the existing whitespace between inline elements.
  compressHTML: true,
  server: {
    port: 54321,
  },

  vite: {
    // Vite 8's Oxc transform does not yet lower the standard decorators used by Lit.
    plugins: [babel({
      presets: [{
        preset: () => ({
          // Preserve TypeScript assignment semantics without weakening private fields.
          assumptions: { setPublicClassFields: true },
          plugins: [
            [decorators, { version: '2023-11' }],
            // Lower Babel's generated fields before Oxc processes their super() calls.
            classStaticBlock,
            classProperties,
          ],
        }),
        rolldown: {
          filter: {
            id: /\/(?:packages\/components\/[^/]+\/examples\/lit|shared\/src\/lit\/components)\/[^/]+\.ts$/,
            code: '@',
          },
        },
      }],
    })],
    server: {
      fs: {
        allow: [
          fileURLToPath(new URL('./', import.meta.url)),
          fileURLToPath(new URL('../node_modules/', import.meta.url)),
          fileURLToPath(new URL('../packages/', import.meta.url)),
        ],
      },
    },
  },

  // Enable many frameworks to support all different kinds of components.
  integrations: [
    react({ include: ['**/react/*', '**/react.stories.ts'], experimentalReactChildren: true }),
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
      title: 'Destyler',
      css: [
        './src/style/bootstrap.css',
        './src/style/reset.css',
      ],
    }),
  ],
})
