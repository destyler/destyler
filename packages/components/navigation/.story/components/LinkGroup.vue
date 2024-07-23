<script setup lang="ts">
import { NavigationLink } from '../../src'

defineProps<{
  items: string[]
}>()
</script>

<template>
  <ul class="m-0 flex flex-col list-none gap-2 p-[22px]">
    <li v-for="(item, index) in items" :key="index">
      <NavigationLink
        href="#example"
        class="flex items-center hover:bg-gray-200 px-4 py-2 rounded"
      >
        {{ item }}
      </NavigationLink>
    </li>
  </ul>
</template>
