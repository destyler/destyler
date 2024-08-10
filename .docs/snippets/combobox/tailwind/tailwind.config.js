/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.vue'],
  theme: {
    extend: {
      colors: {
        'primary': '#27272A',
        'foreground': '#FAFAFA',
        'border': '#27272A',
        'accent': '#27272A',
        'accent-foreground': '#FAFAFA',
        'muted-foreground': '#A1A1AA',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
