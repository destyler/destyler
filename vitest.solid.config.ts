import path from 'node:path'
import Solid from 'vite-plugin-solid'
import { defineProject } from 'vitest/config'

export default defineProject({
  resolve: {
    alias: {
      '~/solid/': `${path.resolve(__dirname, 'examples/solid/src/pages')}/`,
    },
  },
  plugins: [
    Solid(),
  ],
  test: {
    name: {
      label: 'solid',
      color: 'cyan',
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
      'packages/**/react.browser.spec.{js,ts,jsx,tsx}',
      'packages/**/vanilla.browser.spec.{js,ts,jsx,tsx}',
      'packages/**/vue.browser.spec.{js,ts,jsx,tsx}',
      'packages/**/svelte.browser.spec.{js,ts,jsx,tsx}',
    ],
    include: [
      'packages/**/solid.browser.spec.{js,ts,jsx,tsx}',
    ],
  },
})
