import { createApp } from 'vue'
import {
  createRouter,
  createWebHistory,
  setupDataFetchingGuard,
} from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'

import App from './App.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  extendRoutes: routes => setupLayouts(routes),
})

setupDataFetchingGuard(router)

const app = createApp(App)

app.use(router)

app.mount('#app')
