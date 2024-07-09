/// <reference types="histoire" />

import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    Vue(),
  ],
  server: {
    fs: {
      allow: ['..'],
    },
    host: true,
  },
})
