/// <reference types="@vitest/browser/providers/playwright" />

import path from 'node:path'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'node',
          environment: 'node',
          include: [
            'packages/**/*.test.{js,ts,jsx,tsx}',
          ],
        },
      },
      {
        resolve: {
          alias: {
            '~/vue/': `${path.resolve(__dirname, 'examples/vue/src/pages')}/`,
          },
        },
        plugins: [
          Vue(),
          UnoCSS(),
        ],
        test: {
          name: 'browser',
          environment: 'jsdom',
          browser: {
            enabled: true,
            provider: 'playwright',
            instances: [
              { browser: 'chromium', name: 'browser-chromium' },
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
            'packages/**/*.solid.browser.spec.{js,ts,jsx,tsx}',
            'packages/**/*.vanilla.browser.spec.{js,ts,jsx,tsx}',
            'packages/**/*.react.browser.spec.{js,ts,jsx,tsx}',
            'packages/**/*.svelte.browser.spec.{js,ts,jsx,tsx}',
          ],
          include: [
            'packages/**/*.vue.browser.spec.{js,ts,jsx,tsx}',
          ],
        },
      },
    ],
  },
})
