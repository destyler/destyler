import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    Vue(),
  ],
  test: {
    setupFiles: './vitest.setup.ts',
    environment: 'jsdom',
    exclude: ['**/node_modules/**'],
    coverage: {
      provider: 'istanbul', // or 'v8'
    },
    server: {
      deps: {
        inline: ['vitest-canvas-mock'],
      },
    },
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  },
})
