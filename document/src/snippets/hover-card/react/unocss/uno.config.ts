import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      border: 'hsl(240 3.7% 15.9%)',
      input: 'hsl(240 3.7% 15.9%)',
      ring: 'hsl(240 4.9% 83.9%)',
      background: 'hsl(240 10% 3.9%)',
      foreground: 'hsl(0 0% 98%)',
      primary: {
        DEFAULT: 'hsl(0 0% 98%)',
        foreground: 'hsl(240 5.9% 10%)',
      },
      secondary: {
        DEFAULT: 'hsl(240 3.7% 15.9%)',
        foreground: 'hsl(0 0% 98%)',
      },
      destructive: {
        DEFAULT: 'hsl(0 62.8% 30.6%)',
        foreground: 'hsl(0 85.7% 97.3%)',
      },
      muted: {
        DEFAULT: 'hsl(240 3.7% 15.9%)',
        foreground: 'hsl(240 5% 64.9%)',
      },
      accent: {
        DEFAULT: 'hsl(240 3.7% 15.9%)',
        foreground: 'hsl(0 0% 98%)',
      },
      popover: {
        DEFAULT: 'hsl(240 10% 3.9%)',
        foreground: 'hsl(0 0% 98%)',
      },
      card: {
        DEFAULT: 'hsl(240 10% 3.9%)',
        foreground: 'hsl(0 0% 98%)',
      },
    },
    borderRadius: {
      xl: 'calc(0.5rem + 4px)',
      lg: '0.5rem',
      md: 'calc(0.5rem - 2px)',
      sm: 'calc(0.5rem - 4px)',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      warn: true,
      extraProperties: {
        'width': '1.23rem',
        'height': '1.23rem',
        'display': 'inline-block',
        'vertical-align': 'text-bottom',
      },
    }),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
})
