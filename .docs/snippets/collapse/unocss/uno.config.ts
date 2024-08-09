import { defineConfig } from 'unocss'

export default defineConfig({
  rules: [
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
  ],
  preflights: [
    {
      getCSS: () => `
        @keyframes collapse-down {
          from{
            height: 0
          }
          to {
            height: var(--destyler-collapse-content-height)
          }
        }
        @keyframes collapse-up {
          from{
            height:
              var(--destyler-collapse-content-height)
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
      'primary': '#27272A',
      'primary-foreground': '#FFFFFF',
      'accent-foreground': '#FFFFFF',
    },
  },
})
