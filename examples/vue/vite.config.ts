import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import UnoCss from 'unocss/vite'
import { alias } from '../../vite.path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias,
  },
  plugins: [
    VueDevTools(),
    Vue(),
    UnoCss(),
  ],
})
