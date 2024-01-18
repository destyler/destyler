import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Component from 'unplugin-vue-components/vite'
import VueDevtools from 'vite-plugin-vue-devtools'
import UnoCss from 'unocss/vite'
import { alias } from '../vite.path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueDevtools(),
    Vue(),
    UnoCss(),
    Component({
      dirs: [
        '../packages/components',
      ],
      dts: true,
      deep: true,
      directoryAsNamespace: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.ts$/, /\.ts\?ts/],
      exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
    }),
  ],
  resolve: {
    alias,
  },
})
