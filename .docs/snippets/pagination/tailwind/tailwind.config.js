/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.vue'],
  theme: {
    extend: {
      colors: {
        'background': 'rgb(8.95, 8.95, 10.9)',
        'foreground': 'rgb(250, 250, 250)',
        'card': 'rgb(8.95, 8.95, 10.9)',
        'card-foreground': 'rgb(250, 250, 250)',
        'popover': 'rgb(8.95, 8.95, 10.9)',
        'popover-foreground': 'rgb(250, 250, 250)',
        'primary': 'rgb(250, 250, 250)',
        'primary-foreground': 'rgb(24, 24, 27)',
        'secondary': 'rgb(39, 39, 42)',
        'secondary-foreground': 'rgb(250, 250, 250)',
        'muted': 'rgb(39, 39, 42)',
        'muted-foreground': 'rgb(161, 161, 170)',
        'accent': 'rgb(39, 39, 42)',
        'accent-foreground': 'rgb(250, 250, 250)',
        'destructive': 'rgb(127, 29, 29)',
        'destructive-foreground': 'rgb(254, 242, 242)',
        'border': 'rgb(39, 39, 42)',
        'input': 'rgb(39, 39, 42)',
      },
    },
  },
}
