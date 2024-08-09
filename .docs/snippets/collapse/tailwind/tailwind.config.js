/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.vue'],
  theme: {
    extend: {
      colors: {
        'primary': '#27272A',
        'primary-foreground': '#FFFFFF',
      },
      keyframes: {
        collapseDown: {
          from: {
            height: 0,
          },
          to: {
            height: 'var(--destyler-collapse-content-height)',
          },
        },
        collapseUp: {
          from: {
            height: 'var(--destyler-collapse-content-height)',
          },
          to: {
            height: 0,
          },
        },
      },
      animation: {
        'collapse-down': 'collapseDown 200ms cubic-bezier(0.87, 0, 0.13, 1)',
        'collapse-up': 'collapseUp 200ms cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
  },
  plugins: [],
}
