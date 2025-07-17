import path from 'node:path'
import React from '@vitejs/plugin-react'
import { defineProject } from 'vitest/config'

export default defineProject({
  resolve: {
    alias: {
      '~/react/': `${path.resolve(__dirname, 'examples/react/src/pages')}/`,
    },
  },
  plugins: [
    React(),
  ],
  test: {
    name: {
      label: 'react',
      color: 'blue',
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
      'packages/**/vue.browser.spec.{js,ts,jsx,tsx}',
      'packages/**/svelte.browser.spec.{js,ts,jsx,tsx}',
    ],
    include: [
      'packages/**/react.browser.spec.{js,ts,jsx,tsx}',

    ],
  },
})
