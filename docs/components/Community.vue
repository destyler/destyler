<script setup lang="ts">
import { DestylerIcon } from 'destyler'

const edits = ref([
  {
    icon: 'radix-icons:pencil-2',
    title: 'Edit this page',
    type: 'dynamic',
    href: 'https://github.com/destyler/destyler/tree/main/docs/content',
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

const router = useRouter()
</script>

<template>
  <ul class="m-0 list-none">
    <li v-for="(edit, index) in edits" :key="index" class="mt-0 pt-2">
      <NuxtLink
        class="flex items-center inline-block no-underline transition-colors text-#09090b dark:text-#fafafa text-op-60! hover:text-op-80! hover:text-op-100!"
        :to="edit.type === 'static' ? edit.href : `${edit.href + router.currentRoute.value.fullPath}`"
        target="_blank"
      >
        <DestylerIcon class="w-4 h-4 mr-2" :name="edit.icon" />
        {{ edit.title }}
      </NuxtLink>
    </li>
  </ul>
</template>
