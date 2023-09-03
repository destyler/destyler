import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { DestylerUIPresets, DestylerUIResolver } from 'destyler'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        DestylerUIPresets,
      ],
    }),
    Components({
      resolvers: [
        DestylerUIResolver(),
      ],
    }),
  ],
})
