import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetAnimations } from 'unocss-preset-animations'

import { generateCSSVars, generateGlobalStyles } from './.vitepress/colors/generate'
import { themes } from './.vitepress/colors/themes'

export const builtinColors = themes.map(theme => theme.name)
export const builtinRadiuses = [0, 0.3, 0.5, 0.75, 1] as const

export default defineConfig({
  shortcuts: [
    ['btn', 'focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-2.5 px-3.5 py-2.5 shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-500 dark:focus-visible:outline-light-400 inline-flex items-center'],
    ['head-btn', 'focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 p-1.5 text-[var(--header-primary)] hover:text-[var(--header-primary)] hover:bg-[var(--header-accent-foreground)] focus-visible:ring-inset focus-visible:ring-2 inline-flex items-center bg-transparent'],
  ],
  rules: [
    [/^slide-enter-(\d+)$/, ([_, n]) => ({
      '--enter-stage': n,
    })],
    [
      'animate-collapse-down',
      {
        animation: 'collapse-down 0.2s ease-out',
      },
    ],
    [
      'animate-collapse-up',
      {
        animation: 'collapse-up 0.2s ease-out',
      },
    ],
    [
      'animate-collapsible-down',
      {
        animation: 'collapsible-down 0.2s ease-out',
      },
    ],
    [
      'animate-collapsible-up',
      {
        animation: 'collapsible-up 0.2s ease-out',
      },
    ],
  ],
  preflights: [
    {
      getCSS: () => `
        @keyframes collapse-down { from{ height: 0 } to { height: var(--destyler-collapse-content-height)} }
        @keyframes collapse-up { from{ height: var(--destyler-collapse-content-height)} to { height: 0 } }
        @keyframes collapsible-down { from{ height: 0 } to { height: var(--destyler-collapsible-content-height)} }
        @keyframes collapsible-up { from{ height: var(--destyler-collapsible-content-height)} to { height: 0 } }
        ${generateCSSVars(builtinColors.map(c => ({ color: c })))}
        ${generateGlobalStyles()}
      `,
    },
  ],
  theme: {
    colors: {
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))',
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))',
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))',
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))',
      },
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))',
      },
    },
    maxWidth: {
      main: '750px',
    },
    height: {
      header: '64px',
      footer: '50px',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetAnimations() as any,
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
