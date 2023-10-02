import path from 'node:path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import Unocss from 'unocss/vite'
import {
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  resolve: {
    alias: {
      '@destyler/': `${path.resolve(__dirname, '../packages/components')}/`,
    },
  },
  optimizeDeps: {
    exclude: ['vitepress'],
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    Components({
      include: [/\.vue/, /\.md/],
      dirs: '.vitepress/components',
      dts: '.vitepress/components.d.ts',
    }) as Plugin,
    Unocss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
          extraProperties: {
            'display': 'inline-block',
            'height': '1.2em',
            'width': '1.2em',
            'vertical-align': 'text-bottom',
          },
        }),
        presetWebFonts(),
      ],
      transformers: [
        transformerDirectives(),
      ],
    }),
  ],
})
