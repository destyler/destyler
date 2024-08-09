<script setup lang="ts">
import { ref } from 'vue'
import { useData } from 'vitepress'
import { Icon, Link } from 'destyler'

const { page } = useData()

const edits = ref([
  {
    icon: 'radix-icons:pencil-2',
    title: 'Edit this page',
    type: 'dynamic',
    href: 'https://github.com/destyler/destyler/tree/main/.docs/',
  },
  {
    icon: 'radix-icons:star',
    title: 'Star on GitHub',
    type: 'static',
    href: 'https://github.com/destyler/destyler',
  },
  {
    icon: 'radix-icons:chat-bubble',
    title: 'Chat on Discord ',
    type: 'static',
    href: 'https://discord.gg/SwgESrV7HY',
  },
])
</script>

<template>
  <div class="flex items-center gap-1.5 lg:cursor-text lg:select-text w-full group" tabindex="-1">
    <span class="font-semibold text-sm/6 truncate">Community</span>
  </div>
  <ul class="space-y-3 lg:space-y-1.5">
    <li v-for="(item, index) in edits" :key="index" class="mt-0 pt-2">
      <Link
        class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        :to="item.type === 'static' ? item.href : `${item.href + page.filePath}`"
        target="_blank"
      >
        <Icon class="w-5 h-5 flex-shrink-0" :name="item.icon" />
        <span class="text-sm/6 font-medium relative">{{ item.title }}</span>
      </Link>
    </li>
  </ul>
</template>
