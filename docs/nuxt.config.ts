// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // @see https://github.com/unocss/unocss/issues/3468#issuecomment-1871049463
  features: {
    inlineStyles: false,
  },
  modules: [
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/content',
  ],
  colorMode: {
    classSuffix: '',
  },
  css: [
    '@unocss/reset/tailwind.css',
    '~/style/main.css',
  ],
  content: {
    documentDriven: true,
    markdown: {
      tags: {
        h1: 'ProseH1',
        blockquote: 'ProseBlockquote',
      },
    },
    highlight: {
      theme: {
        default: 'vitesse-light',
        dark: 'vitesse-dark',
      },
    },
  },

  devtools: { enabled: true },
})
