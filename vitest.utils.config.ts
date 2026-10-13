import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    // Preserve the pre-Vitest 5 mock lifecycle; suites manage their own cleanup.
    clearMocks: false,
    name: {
      label: 'node',
      color: 'yellow',
    },
    environment: 'node',
    environmentOptions: {
      happyDOM: {
        settings: {
          enableIframePageLoading: true,
        },
      },
    },
    include: [
      'packages/**/*.test.{js,ts,jsx,tsx}',
    ],
  },
})
