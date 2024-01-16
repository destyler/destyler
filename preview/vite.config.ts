import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Component from 'unplugin-vue-components/vite'
import { alias } from '../vite.path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
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
