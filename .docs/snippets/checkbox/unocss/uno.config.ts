import { defineConfig, presetAttributify } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      'background': '240 10% 3.9%',
      'foreground': '0 0% 98%',
      'card': '240 10% 3.9%',
      'card-foreground': '0 0% 98%',
      'popover': '240 10% 3.9%',
      'popover-foreground': '0 0% 98%',
      'primary': '0 0% 98%',
      'primary-foreground': '240 5.9% 10%',
      'secondary': '240 3.7% 15.9%',
      'secondary-foreground': '0 0% 98%',
      'muted': '240 3.7% 15.9%',
      'muted-foreground': '240 5% 64.9%',
      'accent': '240 3.7% 15.9%',
      'accent-foreground': '0 0% 98%',
      'destructive': '0 62.8% 30.6%',
      'destructive-foreground': '0 85.7% 97.3%',
      'border': '240 3.7% 15.9%',
      'input': '240 3.7% 15.9%',
    },
  },
  presets: [
    presetAttributify(),
  ],
})
