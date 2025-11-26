import { defineConfig } from 'vitest/config'
import Browser from './vitest.browser.config'
import Utils from './vitest.utils.config'

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
      exclude: [
        'packages/components/**/docs/**',
        'packages/components/**/examples/**',
        'packages/components/**/snippets/**',
        'packages/components/**/storybook/**',
        '**.css',
      ],
    },
    projects: [
      Utils,
      Browser,
    ],
  },
})
