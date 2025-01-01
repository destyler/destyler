<script setup lang="ts">
import { useRouter } from 'vue-router'

const router =useRouter()
</script>

<template>
  <main class="p-4">
    <div class="p-2">
      <RouterView />
    </div>
    <div class="flex gap-2 border-t border-dark mt-5">
    <a
      v-for="i in router.getRoutes()"
      :key="i.path"
      :href="i.path"
    >
      {{ i.name === '/' ? 'home' : i.name }}
    </a>
  </div>
  </main>
</template>

<style scoped>

</style>
