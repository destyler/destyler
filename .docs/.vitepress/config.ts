import { defineConfig } from 'vitepress'
import { slugify } from './scripts/slugify'
import PreviewPlugin from './plugins/preview'
import { preWrapperPlugin } from './plugins/preWrapper'

export default defineConfig({
  title: 'Destyler',
  description: 'i hope every sunny afternoon can be wasted.',
  lang: 'en-US',
  appearance: false,
  lastUpdated: true,
  cleanUrls: true,
  outDir: './dist',
  markdown: {
    theme: 'vitesse-dark',
    preConfig(md) {
      md.use(PreviewPlugin)
    },
    config(md) {
      md.use(preWrapperPlugin)
    },
    toc: {
      slugify,
      level: [1, 2, 3, 4],
    },
  },
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: 'https://elonehoo.me/logo/dark.svg', sizes: 'any', type: 'image/svg+xml' }],
    ['link', { rel: 'icon', href: 'https://elonehoo.me/favicon.svg', sizes: '48x48' }],
    ['meta', { name: 'author', content: 'Elone Hoo' }],
    ['meta', { property: 'og:title', content: 'Elone Hoo Blog' }],
    ['meta', { property: 'og:description', content: 'I hope every sunny afternoon can be wasted.' }],
    ['meta', { name: 'X:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@elonehoo' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
    ['link', { rel: 'apple-touch-icon', href: 'https://elonehoo.me/avatar.png', sizes: '180x180' }],

    ['link', { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' }],
    ['link', { rel: 'preconnect', crossorigin: 'anonymous', href: 'https://fonts.gstatic.com' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap' }],
    ['script', {}, `(function() {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const setting = localStorage.getItem('color-schema') || 'auto'
      if (setting === 'dark' || (prefersDark && setting !== 'light'))
        document.documentElement.classList.toggle('dark', true)
    })()`],
  ],
  themeConfig: {
    nav: [
      { text: 'Docs', link: '/guide/introduction' },
      { text: 'Components', link: '/components' },
      { text: 'Blog', link: '/blog' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Install', link: '/guide/install' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'AspectRadio', link: '/components/aspectRadio' },
        ],
      },
    ],
  },
  vite: {
    ssr: {
      noExternal: ['p5i'],
    },
  },
})
