import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import Solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [
    Solid(),
    UnoCSS(),
  ],
})
