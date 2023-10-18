import { defineConfig } from 'vitepress'
import { version } from '../../package.json'
import {
  contributing,
  destylerDescription,
  destylerName,
  discord,
  font,
  github,
  mastodon,
  ogImage,
  ogUrl,
  releases,
  twitter,
} from './meta'

export default defineConfig({
  lang: 'en-US',
  title: destylerName,
  description: destylerDescription,
  head: [
    ['meta', { name: 'theme-color', content: '#729b1a' }],
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Elone Hoo' }],
    ['meta', { name: 'keywords', content: 'unstyled component for vue.' }],
    ['meta', { property: 'og:title', content: destylerName }],
    ['meta', { property: 'og:description', content: destylerDescription }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { name: 'twitter:title', content: destylerName }],
    ['meta', { name: 'twitter:description', content: destylerDescription }],
    ['meta', { name: 'twitter:image', content: ogImage }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'preload', as: 'style', onload: 'this.onload=null;this.rel=\'stylesheet\'', href: font }],
    ['noscript', {}, `<link rel="stylesheet" crossorigin="anonymous" href="${font}" />`],
    ['link', { rel: 'mask-icon', href: '/logo.svg', color: '#ffffff' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
  ],
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
      { icon: 'mastodon', link: mastodon },
      { icon: 'twitter', link: twitter },
      { icon: 'discord', link: discord },
      { icon: 'github', link: github },
    ],
    nav: [
      {
        text: `v${version}`,
        items: [
          {
            text: 'Release Notes ',
            link: releases,
          },
          {
            text: 'Contributing ',
            link: contributing,
          },
        ],
      },
    ],
    sidebar: {
      '/': [
        {
          text: 'Components',
          collapsed: false,
          items: [
            { text: 'Accord', link: '/components/accord' },
            { text: 'Avatar', link: '/components/avatar' },
            { text: 'Button', link: '/components/button' },
          ],
        },
      ],
    },

  },
})
