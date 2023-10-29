import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Router from 'unplugin-vue-router/vite'
import Layouts from 'vite-plugin-vue-layouts'
import UnoCss from 'unocss/vite'

import { VueRouterAutoImports } from 'unplugin-vue-router'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@destyler/components': `${path.resolve(__dirname, '../packages/components')}/`,
    },
  },
  plugins: [
    Router(),
    Layouts(),
    UnoCss(),
    vue(),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          'vue-router/auto': ['useLink'],
        },
      ],
    }),
    Components({
      dirs: ['src/components'],
      directoryAsNamespace: true,
    }),
  ],
})
