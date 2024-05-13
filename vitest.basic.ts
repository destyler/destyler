import path from 'node:path'
import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname)}/`,
    },
  },
  plugins: [
    Vue(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
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
