import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import pkg from '../package.json'
import replPkg from '@vue/repl/package.json' assert { type: 'json' }

const pathSrc = path.resolve(__dirname, 'src')

export default defineConfig({
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(pkg.version),
    'import.meta.env.REPL_VERSION': JSON.stringify(replPkg.version),
  },
  build: {
    rollupOptions: {
      external: ['typescript'],
    },
  },
  server: {
    host: true,
  },
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true,
        fs: {
          fileExists: fs.existsSync,
          readFile: (file) => fs.readFileSync(file, 'utf-8'),
        },
      },
    }),
    AutoImport({
      dirs: [
        path.resolve(pathSrc, 'composables')
      ],
      imports: [
        'vue',
        '@vueuse/core'
      ],
      dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
    }),
    Components({
      dirs: [
        path.resolve(pathSrc, 'components')
      ],
      dts: path.resolve(pathSrc, 'components.d.ts'),
    }),
    Unocss(),
  ],
  optimizeDeps: {
    exclude: ['@vue/repl'],
  },
})
