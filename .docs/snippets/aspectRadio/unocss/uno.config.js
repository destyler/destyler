import { defineConfig, presetAttributify } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: '#27272A',
    },
  },
  presets: [
    presetAttributify(),
  ],
})
