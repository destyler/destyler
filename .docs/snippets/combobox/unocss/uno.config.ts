import { defineConfig } from 'unocss'
import { presetAnimations } from 'unocss-preset-animations'

export default defineConfig({
  theme: {
    colors: {
      'primary': '#27272A',
      'foreground': '#FAFAFA',
      'border': '#27272A',
      'accent': '#27272A',
      'accent-foreground': '#FAFAFA',
      'muted-foreground': '#A1A1AA',
    },
  },
  presets: [
    presetAnimations() as any,
  ],
})
