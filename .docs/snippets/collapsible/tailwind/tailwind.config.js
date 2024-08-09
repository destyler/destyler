/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.vue'],
  theme: {
    extend: {
      colors: {
        primary: '#27272A',
      },
      keyframes: {
        collapsibleDown: {
          from: {
            height: 0,
          },
          to: {
            height: 'var(--destyler-collapsible-content-height)',
          },
        },
        collapsibleUp: {
          from: {
            height: 'var(--destyler-collapsible-content-height)',
          },
          to: {
            height: 0,
          },
        },
      },
      animation: {
        'collapsible-down': 'collapsibleDown 200ms cubic-bezier(0.87, 0, 0.13, 1)',
        'collapsible-up': 'collapsibleUp 200ms cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
  },
  plugins: [],
}
