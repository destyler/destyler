// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
  ],
  devtools: {
    enabled: true,
  },
  css: [
    '@unocss/reset/tailwind.css',
  ],
})
