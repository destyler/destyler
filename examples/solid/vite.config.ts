import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import Solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [
    Solid(),
    UnoCSS(),
    Pages(),
  ],
})
