import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import UnoCss from 'unocss/vite'
import { alias } from '../../vite.path'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    port: 51201
  },
  base:'/__destyler_play_vue__',
  resolve: {
    alias,
  },
  plugins: [
    VueDevTools(),
    Vue(),
    UnoCss(),
  ],
})
