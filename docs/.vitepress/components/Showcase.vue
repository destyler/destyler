<script setup lang="ts">
import { computed } from 'vue'

const { title, play } = defineProps<{
  title: string
  play?: string
}>()

const computedTitle = computed(() => {
  return `${title.replace(/^\S/, s => s.toUpperCase())} Demo`
})
</script>

<template>
  <br>
  <div class="border -mx-3 my-0 rounded-md border-solid border-gray-100 dark:border-dark-800 sm:m-0">
    <div class="flex justify-between bg-light-800 dark:bg-dark-400 pl-4 pr-3 py-3 rounded-[6px_6px_0_0] border-b-gray-100 dark:border-b-dark-800 border-b border-solid">
      <p class="leading-7 text-xs font-medium translate-y-px whitespace-nowrap overflow-hidden text-ellipsis m-0! pr-6;">
        {{ computedTitle }}
      </p>
      <a v-if="play" class="button" :href="play" target="_blank">
        <button class="btn-green">View Playground</button>
      </a>
    </div>

    <div class="bg-light-100 dark:bg-neutral-900 p-6 rounded-[0_0_6px_6px] sm:p-8">
      <slot />
    </div>
  </div>
</template>

<style scoped>

</style>
