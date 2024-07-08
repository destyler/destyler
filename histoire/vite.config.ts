/// <reference types="histoire" />

import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  resolve: {
    alias: {
      '~/components/': `${path.resolve(__dirname, '../packages/components')}/`,
    }
  },
  plugins: [vue()],
  histoire: {
    // Histoire config can also go here
  },
})
