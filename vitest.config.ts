import { defineConfig } from 'vitest/config'
import Browser from './vitest.browser.config'
import Utils from './vitest.utils.config'

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: [
        'text',
        'json-summary',
        'json',
        'html',
      ],
      reportsDirectory: './html/coverage',
      reportOnFailure: true,
      exclude: [
        'packages/components/**/docs/**',
        'packages/components/**/examples/**',
        'packages/components/**/snippets/**',
        'packages/components/**/storybook/**',
        'packages/components/**/index.ts',
        'packages/shareds/**/index.ts',
        'packages/**/index.ts',
        '**.css',
        '**/dist/**',
        'shared/**',
      ],
    },
    projects: [
      Utils,
      Browser,
    ],
  },
})
