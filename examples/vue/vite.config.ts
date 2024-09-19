import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import UnoCss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 51201,
  },
  base: '/__destyler_play_vue__/',
  resolve: {
    alias: {
      '~/components/': `${path.resolve(__dirname, '../../packages/components')}/`,
    },
  },
  plugins: [
    VueDevTools(),
    Vue(),
    UnoCss(),
  ],
})
