<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ProgressIndicator, ProgressRoot } from '@destyler/progress'

const value = ref(10)

onMounted(() => {
  const timer = setTimeout(() => (value.value = 66), 500)
  return () => clearTimeout(timer)
})
</script>

<template>
  <ProgressRoot
    v-model="value"
    class="relative h-2 overflow-hidden rounded-full bg-primary/20 w-[40%]!"
    style="transform: translateZ(0)"
  >
    <ProgressIndicator
      class="h-full w-full flex-1 bg-primary transition-all"
      :style="`transform: translateX(-${100 - value}%)`"
    />
  </ProgressRoot>
</template>
