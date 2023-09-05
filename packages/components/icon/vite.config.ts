/// <reference types="vitest" />

import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
  },
})
