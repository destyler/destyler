<script setup lang="ts">
import { ref } from 'vue'
import { DestylerProgressIndicator, DestylerProgressRoot } from 'destyler'

const interactive = ref(0)
setTimeout(() => {
  interactive.value = (interactive.value + 66) % 100
}, 200)
</script>

<template>
  <DestylerProgressRoot
    v-model="interactive"
    class="relative h-2 w-60% overflow-hidden rounded-full dark:bg-#FAFAFA/20 bg-#18181B/20"
  >
    <DestylerProgressIndicator
      class="h-full w-full flex-1 dark:bg-#FAFAFA bg-#18181B transition-all"
      :style="`transform: translateX(-${100 - interactive}%)`"
    />
  </DestylerProgressRoot>
</template>
