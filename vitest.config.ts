import Vue from '@vitejs/plugin-vue'
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
        plugins: [
          Vue(),
        ],
        test: {
          name: 'browser',
          browser: {
            enabled: true,
            provider: 'playwright',
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: [
            './vitest.browser.setup.ts',
          ],
          include: [
            'packages/**/*.vue.browser.spec.{js,ts,jsx,tsx}',
          ],
        },
      },
    ],
  },
})
