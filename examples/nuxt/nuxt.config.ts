import { alias } from '../../vite.path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  vite: {
    resolve: {
      alias,
    },
  },
})
