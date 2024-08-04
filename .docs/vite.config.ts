import path from 'node:path'
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import Component from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  optimizeDeps: {
    exclude: ['@vueuse/core', 'vitepress', '@vueuse/shared', 'vue-demi'],
  },
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, '.vitepress')}/`,
      '@/': `${path.resolve(__dirname, '../packages')}/`,
    },
  },
  plugins: [
    Component({
      include: [/\.vue/, /\.md/],
      dirs: [
        '.vitepress/theme/components',
        '.vitepress/theme/global',
        '.vitepress/components',
      ],
      dts: '.vitepress/components.d.ts',
    }),
    AutoImport({
      dirs: [
        '.vitepress/composables',
      ],
      imports: [
        'vue',
        'vitepress',
        '@vueuse/core',
      ],
      dts: '.vitepress/auto-imports.d.ts',
    }),
    Unocss(),
    VueDevTools(),
  ],
})
