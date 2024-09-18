import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { transformerColorHighlight } from 'shiki-transformer-color-highlight'
import { slugify } from './scripts/slugify'
import PreviewPlugin from './plugins/preview'
import { preWrapperPlugin } from './plugins/preWrapper'
import { snippetPlugin } from './plugins/snippet'

export default defineConfig({
  title: 'Destyler',
  description: 'unstyled component for vue.',
  lang: 'en-US',
  appearance: false,
  lastUpdated: true,
  cleanUrls: true,
  markdown: {
    theme: 'vitesse-dark',
    codeTransformers: [
      transformerTwoslash(),
    ],
    preConfig(md) {
      md.use(PreviewPlugin)
      md.use(snippetPlugin)
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
    ['link', { rel: 'icon', href: '/logo.svg', sizes: 'any', type: 'image/svg+xml' }],
    ['link', { rel: 'icon', href: '/logo.svg', sizes: '48x48' }],
    ['meta', { name: 'author', content: 'Elone Hoo' }],
    ['meta', { property: 'og:title', content: 'Elone Hoo Blog' }],
    ['meta', { property: 'og:description', content: 'I hope every sunny afternoon can be wasted.' }],
    ['meta', { name: 'X:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@elonehoo' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
    ['link', { rel: 'apple-touch-icon', href: 'https://destyler-dev.zeabur.app/logo.svg', sizes: '180x180' }],
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
      { text: 'Components', link: '/components/checkbox' },
      { text: 'Blog', link: '/blog' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Overview',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Getting started', link: '/guide/getting-started' },
            { text: 'Install', link: '/guide/install' },
          ],
        },
        {
          text: 'Guides',
          items: [
            {
              text: 'Styling',
              link: '/guide/styling',
            },
            {
              text: 'Animation',
              link: '/guide/animation',
            },
            {
              text: 'Composition',
              link: '/guide/composition',
            },
          ],
        },
      ],
      '/components/': [
        {
          text: 'Form',
          items: [
            { text: 'Checkbox', link: '/components/checkbox' },
            { text: 'Combobox', link: '/components/combobox' },
            { text: 'Dynamic', link: '/components/dynamic' },
            { text: 'Label', link: '/components/label' },
            { text: 'OTP Input', link: '/components/otpInput' },
            { text: 'Radio', link: '/components/radio' },
            { text: 'Select', link: '/components/select' },
            { text: 'Slider', link: '/components/slider' },
            { text: 'Switch', link: '/components/switch' },
            { text: 'Toggle', link: '/components/toggle' },
            { text: 'Toggle Group', link: '/components/toggleGroup' },
          ],
        },
        {
          text: 'Dates',
          items: [
            { text: 'Calendar', link: '/components/calendar' },
            { text: 'Range Calendar', link: '/components/rangeCalendar' },
            { text: 'QR Code', link: '/components/qrCode' },
          ],
        },
        {
          text: 'General',
          items: [
            { text: 'AspectRadio', link: '/components/aspectRadio' },
            { text: 'Breadcrumbs', link: '/components/breadcrumbs' },
            { text: 'Button', link: '/components/button' },
            { text: 'Collapse', link: '/components/collapse' },
            { text: 'Collapsible', link: '/components/collapsible' },
            { text: 'Context Menu', link: '/components/context-menu' },
            { text: 'Countdown', link: '/components/countdown' },
            { text: 'Dialog', link: '/components/dialog' },
            { text: 'Divider', link: '/components/divider' },
            { text: 'Dropdown', link: '/components/dropdown' },
            { text: 'Hover Card', link: '/components/hoverCard' },
            { text: 'Icon', link: '/components/icon' },
            { text: 'Image', link: '/components/image' },
            { text: 'Info', link: '/components/info' },
            { text: 'Link', link: '/components/link' },
            { text: 'Menubar', link: '/components/menubar' },
            { text: 'Modal', link: '/components/modal' },
            { text: 'Navigation', link: '/components/navigation' },
            { text: 'Online', link: '/components/online' },
            { text: 'Pagination', link: '/components/pagination' },
            { text: 'Popover', link: '/components/popover' },
            { text: 'Preview', link: '/components/preview' },
            { text: 'Progress', link: '/components/progress' },
            { text: 'Scroll Area', link: '/components/scrollArea' },
            { text: 'Splitter', link: '/components/splitter' },
            { text: 'Tabs', link: '/components/tabs' },
            { text: 'Toast', link: '/components/toast' },
            { text: 'Toolbar', link: '/components/toolbar' },
            { text: 'Tooltip', link: '/components/tooltip' },
          ],
        },
      ],
      '/blog/': [
        {
          text: 'Blog',
          items: [
            { text: 'Destyler v0.0.4', link: '/blog/release-0.0.4' },
          ],
        },
      ],
    },
  },
  vite: {
    ssr: {
      noExternal: ['p5i'],
    },
  },
})
