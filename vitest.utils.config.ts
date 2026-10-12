import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
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
