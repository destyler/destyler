import { defineConfig } from 'vitest/config'
import Browser from './vitest.browser.config'
import Utils from './vitest.utils.config'

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
    },
    projects: [
      Utils,
      Browser,
    ],
  },
})
