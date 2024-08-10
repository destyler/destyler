import { defineConfig, presetAttributify } from 'unocss'

export default defineConfig({
  rules: [
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
        @keyframes collapsible-down {
          from{
            height: 0
          }
          to {
            height: var(--destyler-collapsible-content-height)
          }
        }
        @keyframes collapsible-up {
          from{
            height: var(--destyler-collapsible-content-height)
          }
          to {
            height: 0
          }
        }
      `,
    },
  ],
  theme: {
    colors: {
      primary: '#27272A',
    },
  },
  presets: [
    presetAttributify(),
  ],
})
