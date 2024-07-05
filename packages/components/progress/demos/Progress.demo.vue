<script setup lang="ts">
import { ref } from 'vue'
import { ProgressIndicator, ProgressRoot } from '../src'

const interactive = ref(0)
setTimeout(() => {
  // For some reason, this interval triggers twice in the same tick
  interactive.value = (interactive.value + 50) % 100
}, 200)
</script>

<template>
  <ProgressRoot
    v-model="interactive"
    class="relative h-2 w-60% overflow-hidden rounded-full dark:bg-#FAFAFA/20 bg-#18181B/20"
  >
    <ProgressIndicator
      class="h-full w-full flex-1 dark:bg-#FAFAFA bg-#18181B transition-all"
      :style="`transform: translateX(-${100 - interactive}%)`"
    />
  </ProgressRoot>
</template>
