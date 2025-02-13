import React from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-react-components/vite'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'

export default defineConfig({
  plugins: [
    React(),
    Pages(),
    UnoCSS(),
    Components({
      dts: true,
    }),
  ],
})
