import { fileURLToPath } from 'node:url'
import React from '@astrojs/react'
import Solid from '@astrojs/solid-js'
import starlight from '@astrojs/starlight'
import Svelte from '@astrojs/svelte'
import Vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'
import destylerTheme from 'starlight-theme-destyler'
import injectComponents from 'starlight-theme-destyler/vite/inject-components'
import UnoCSS from 'unocss/astro'

const documentRoot = new URL('./', import.meta.url)
const componentsDocsDir = new URL('../packages/components/', import.meta.url)

export default defineConfig({
  markdown: {
    syntaxHighlight: 'shiki',
  },
  integrations: [
    Vue({
      include: ['**/*.vue'],
    }),
    React({
      include: ['**/*.react.tsx'],
      experimentalReactChildren: true,
    }),
    Solid({
      include: [
        '**/*.solid.tsx',
        '**/*/*.solid.tsx',
        '**/node_modules/@suid/material/**',
      ],
    }),
    Svelte({
      include: ['**/*.svelte'],
    }),
    UnoCSS({
      injectReset: true,
    }),
    starlight({
      logo: {
        dark: './src/assets/logo-dark.svg',
        light: './src/assets/logo-light.svg',
        alt: 'Destyler UI',
      },
      editLink: {
        baseUrl: 'https://github.com/destyler/starlight-theme-destyler/edit/main/docs/',
      },
      components: {
        Sidebar: './src/components/Sidebar.astro',
      },
      customCss: [
        './src/styles/index.css',
      ],
      plugins: [
        destylerTheme({
          navLinks: [
            {
              label: 'Overview',
              link: '/guide/getting-started',
            },
            {
              label: 'Components',
              link: '/components/checkbox',
            },
            {
              label: 'Examples',
              link: '/components',
            },
            {
              label: 'Showcase',
              link: '/components',
            },
            {
              label: 'Blog',
              link: '/components',
            },
          ],
          footer: {
            social: [
              {
                url: 'https://discord.gg/SwgESrV7HY',
                icon: 'i-carbon:logo-discord',
              },
              {
                url: 'https://x.com/elonehoo',
                icon: 'i-carbon:logo-x',
              },
              {
                url: 'https://gitub.com/destyler',
                icon: 'i-carbon:logo-github',
              },
            ],
            items: [
              {
                text: 'Figma Kit',
                url: '',
              },
              {
                text: 'Playground',
                url: 'https://play.destyler.org',
              },
              {
                text: 'Roadmap',
                url: 'https://github.com/destyler/destyler/pulls?q=sort:updated-desc+is:pr+is:open',
              },
              {
                text: 'Releases',
                url: 'https://github.com/destyler/destyler/releases',
              },
            ],
          },
        }),
      ],
      sidebar: [
        {
          label: 'Overview',
          items: [
            { slug: 'guide/introduction' },
            { slug: 'guide/getting-started' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { slug: 'guide/styling' },
            { slug: 'guide/composition' },
          ],
        },
        {
          label: 'Form',
          items: [
            { slug: 'components/checkbox' },
            { slug: 'components/combobox' },
            { slug: 'components/dynamic' },
            { slug: 'components/edit' },
            { slug: 'components/file-upload' },
            { slug: 'components/label' },
            { slug: 'components/number-input' },
            { slug: 'components/otp-input' },
            { slug: 'components/radio' },
            { slug: 'components/select' },
            { slug: 'components/signature' },
            { slug: 'components/slider' },
            { slug: 'components/switch' },
            { slug: 'components/toggle-group' },
          ],
        },
        {
          label: 'Dates',
          items: [
          // { slug: 'components/calendar' },
            { slug: 'components/carousel' },
            { slug: 'components/qr-code' },
            { slug: 'components/timer' },
          ],
        },
        {
          label: 'General',
          items: [
            { slug: 'components/aspect-radio' },
            { slug: 'components/breadcrumbs' },
            { slug: 'components/collapse' },
            { slug: 'components/collapsible' },
            { slug: 'components/clipboard' },
            { slug: 'components/color-picker' },
            { slug: 'components/content-menu' },
            // { slug: 'components/countdown' },
            { slug: 'components/dialog' },
            // { slug: 'components/dropdown' },
            { slug: 'components/hover-card' },
            { slug: 'components/image' },
            { slug: 'components/menu' },
            { slug: 'components/pagination' },
            { slug: 'components/popover' },
            { slug: 'components/progress' },
            { slug: 'components/separator' },
            { slug: 'components/splitter' },
            { slug: 'components/steps' },
            { slug: 'components/tabs' },
            // { slug: 'components/toast' },
            // { slug: 'components/toolbar' },
            { slug: 'components/tooltip' },
            { slug: 'components/tree' },
          ],
        },
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/destyler/destyler',
        },
      ],
      title: 'Destyler <span class="text-primary">UI</span>',
    }),
  ],
  vite: {
    server: {
      fs: {
        allow: [
          fileURLToPath(documentRoot),
          fileURLToPath(componentsDocsDir),
        ],
      },
    },
    resolve: {
      alias: {
        '@docs': fileURLToPath(`${documentRoot}/src/`),
        '@component': fileURLToPath(componentsDocsDir),
      },
    },
    plugins: [
      injectComponents({
        Sidebar: './src/components/Sidebar.astro',
      }),
    ],
  },
})
