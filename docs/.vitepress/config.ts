import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'Destyler',
  description: 'unstyled component for Vue.js.',
  cleanUrls: true,
  lastUpdated: true,
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },
  themeConfig: {
    search: {
      provider: 'local',
    },
    outline: [2, 3],

    editLink: {
      pattern: 'https://github.com/elonehoo/ui/edit/main/docs/:path',
      text: 'Suggest changes to this page',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-PRESENT Elone Hoo',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/destyler/destyler' },
    ],

    sidebar: {
      '/': [
        {
          text: 'Components',
          collapsed: false,
          items: [
            { text: 'Accord', link: '/components/accord' },
            { text: 'Avatar', link: '/components/avatar' },
          ],
        },
      ],
    },

  },
})
