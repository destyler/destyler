<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function getRouteName(name: string) {
  if (!name)
    return ''
  return name === '/' ? null : name.replace('/', '')
}
</script>

<template>
  <main class="h-screen p-4 flex">
    <div class="flex flex-col gap-4 w-48 border-r border-gray-200 pr-6">
      <div class="text-xl font-bold text-gray-800 sticky top-0 bg-white">
        <a href="/" class="cursor-pointer">
          Destyler
        </a>
      </div>
      <div class="flex flex-col space-y-2 overflow-y-auto">
        <template v-for="i in router.getRoutes()" :key="i.path">
          <a
            v-if="i.path !== '/'"
            :href="i.path"
            class="px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 text-gray-600 hover:text-dark"
          >
            {{ getRouteName(i.path) }}
          </a>
        </template>
      </div>
    </div>
    <div class="flex-1 pl-6 overflow-y-auto pr-80">
      <slot />
    </div>
  </main>
</template>

<style scoped>
a {
  text-decoration: none;
}

/* 隐藏滚动条但保持可以滚动 */
.overflow-y-auto {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.overflow-y-auto::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
