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
        slideDown: {
          from: { height: 0 },
          to: { height: 'var(--destyler-collapse-content-height)' },
        },
        slideUp: {
          from: { height: 'var(--destyler-collapse-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        slideDown: 'slideDown 200ms cubic-bezier(0.87, 0, 0.13, 1)',
        slideUp: 'slideUp 200ms cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
  },
  plugins: [],
}
