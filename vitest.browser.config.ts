import { playwright } from '@vitest/browser-playwright'
import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    name: {
      label: 'browser',
      color: 'green',
    },
    environment: 'happy-dom',
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
        // { browser: 'firefox' },
        // { browser: 'webkit' },
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
      'packages/**/vue.browser.spec.{js,ts,jsx,tsx}',
      'packages/**/react.browser.spec.{js,ts,jsx,tsx}',
      'packages/**/svelte.browser.spec.{js,ts,jsx,tsx}',
    ],
    include: [
      'packages/**/**.spec.{js,ts,jsx,tsx}',
    ],
  },
})
