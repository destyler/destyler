import { defineConfig } from 'vitest/config'
import Browser from './vitest.browser.config'
import Utils from './vitest.utils.config'

export default defineConfig({
  test: {
    projects: [
      Utils,
      Browser,
    ],
  },
})
