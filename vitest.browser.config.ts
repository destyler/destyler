import { playwright } from '@vitest/browser-playwright'
import { defineProject } from 'vitest/config'

// Pre-bundle framework deps so Vite does not rediscover them mid-suite
// (that triggers "optimized dependencies changed. reloading" and flakes
// calendar import / setup locators / vue watch assertions under load).
const browserOptimizeDeps = [
  'react',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-dom',
  'react-dom/client',
  'vue',
  'solid-js',
  'solid-js/web',
  'solid-js/store',
  'solid-js/h',
  'solid-js/html',
  'vitest-axe/matchers',
]

export default defineProject({
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },
  optimizeDeps: {
    include: browserOptimizeDeps,
  },
  test: {
    name: {
      label: 'browser',
      color: 'green',
    },
    environment: 'happy-dom',
    // Browser Vitest shares one Vite server; mid-run dep discovery reloads
    // the client and breaks in-flight imports / setupFiles. Prefer stability
    // over file parallelism after the suite grew on this PR.
    fileParallelism: false,
    maxConcurrency: 4,
    retry: 1,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
        // { browser: 'firefox' },
        // { browser: 'webkit' },
      ],
      viewport: {
        width: 1920,
        height: 1080,
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
