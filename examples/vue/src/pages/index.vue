<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const routes = router.getRoutes()
  .filter(route => route.path !== '/')
  .map(route => ({
    path: route.path,
    name: (String(route.name || route.path.slice(1))).replace(/^\/+/, '')
  }))
</script>

<template>
  <div class="p-3">
    <h1 class="font-bold text-2xl mb-4">
      Destyler + Vue
    </h1>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
      <div
        v-for="route in routes"
        :key="route.path"
        class="p-2 border rounded-lg hover:shadow-md cursor-pointer transition-shadow text-center"
        @click="router.push(route.path)"
      >
        <h2 class="text-sm font-medium capitalize truncate">
          {{ route.name }}
        </h2>
      </div>
    </div>
  </div>
</template>
