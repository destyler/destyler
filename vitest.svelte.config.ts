import path from 'node:path'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineProject } from 'vitest/config'

export default defineProject({
  resolve: {
    alias: {
      '~/svelte/': `${path.resolve(__dirname, 'examples/svelte/src/pages')}/`,
    },
  },
  plugins: [
    svelte() as any,
  ],
  test: {
    name: {
      label: 'svelte',
      color: 'red',
    },
    environment: 'jsdom',
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [
        { browser: 'chromium' },
      ],
      viewport: {
        width: 834,
        height: 1112,
      },
    },
    setupFiles: [
      './vitest.browser.setup.ts',
    ],
    exclude: [
      'packages/**/solid.browser.spec.{js,ts,jsx,tsx}',
      'packages/**/vanilla.browser.spec.{js,ts,jsx,tsx}',
      'packages/**/react.browser.spec.{js,ts,jsx,tsx}',
      'packages/**/vue.browser.spec.{js,ts,jsx,tsx}',
    ],
    include: [
      'packages/**/svelte.browser.spec.{js,ts,jsx,tsx}',
    ],
  },
})
