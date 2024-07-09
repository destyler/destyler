/// <reference types="histoire" />

import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import DevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    DevTools(),
    Vue(),
  ],
  server: {
    fs: {
      allow: ['..'],
    },
    host: true,
  },
})
