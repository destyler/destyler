/// <reference types="@vitest/browser/providers/playwright" />

import { defineConfig } from 'vitest/config'
import ReactVitestConfig from './vitest.react.config'
import VueVitestConfig from './vitest.vue.config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: {
            label: 'node',
            color: 'yellow',
          },
          environment: 'node',
          include: [
            'packages/**/*.test.{js,ts,jsx,tsx}',
          ],
        },
      },
      VueVitestConfig,
      ReactVitestConfig,
    ],
  },
})
