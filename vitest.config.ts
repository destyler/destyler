import process from 'node:process'
import { defineConfig } from 'vitest/config'
import Browser from './vitest.browser.config.ts'
import Utils from './vitest.utils.config.ts'

export default defineConfig({
  test: {
    // Keep the existing test:deploy artifact root; Vitest 5 otherwise uses .vitest.
    ...(process.env.npm_lifecycle_event === 'test:deploy'
      ? { reporters: [['html', { outputDir: './html' }]] }
      : {}),
    // Keep the node and browser projects' Vite servers independent.
    sharedViteServer: false,
    coverage: {
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
      { ...Utils, extends: false },
      { ...Browser, extends: false },
    ],
  },
})
