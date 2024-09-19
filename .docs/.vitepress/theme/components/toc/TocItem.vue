<script setup lang="ts">
import { Link } from 'destyler'

const props = defineProps<{
  lists: any[]
}>()
</script>

<template>
  <ul class="space-y-1 lg:block">
    <li v-for="header, idx in props.lists" :key="idx" class="space-y-1 lg:block">
      <Link
        class="block text-sm/6 truncate text-dark/70 dark:text-light/70 hover:text-primary"
        :to="header.link"
        :aria-label="`Header Level ${header.level}`"
      >
        {{ header.title }}
      </Link>
      <TocItem v-if="header.children" :lists="header.children" class="ml-4" />
    </li>
  </ul>
</template>
