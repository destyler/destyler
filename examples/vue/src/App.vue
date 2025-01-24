<script setup lang="ts">
import { useRouter } from 'vue-router'

const router =useRouter()
</script>

<template>
  <main class="p-4 flex">
    <div class="flex flex-col gap-2 border-r border-dark mt-5 mr-2 pr-2">
      <a
        v-for="i in router.getRoutes()"
        :key="i.path"
        :href="i.path"
      >
        {{ i.name === '/' ? 'home' : i.name }}
      </a>
    </div>
    <div class="p-2">
      <RouterView />
    </div>
  </main>
</template>

<style scoped>

</style>
