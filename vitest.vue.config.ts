import path from 'node:path'
import Vue from '@vitejs/plugin-vue'
import { defineProject } from 'vitest/config'

export default defineProject({
  resolve: {
    alias: {
      '~/vue/': `${path.resolve(__dirname, 'examples/vue/src/pages')}/`,
    },
  },
  plugins: [
    Vue(),
  ],
  test: {
    name: {
      label: 'vue',
      color: 'green',
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
      'packages/**/svelte.browser.spec.{js,ts,jsx,tsx}',
    ],
    include: [
      'packages/**/vue.browser.spec.{js,ts,jsx,tsx}',
    ],
  },
})
