<script setup lang="ts">
import { DestylerSliderRange, DestylerSliderRoot, DestylerSliderThumb, DestylerSliderTrack } from 'destyler'

const sliderValue = ref([50])
</script>

<template>
  <DestylerSliderRoot
    v-model="sliderValue"
    class="relative flex touch-none select-none items-center w-60%"
    name="slider"
  >
    <DestylerSliderTrack class="relative h-1.5 w-full grow overflow-hidden rounded-full dark:bg-#FAFAFA/20 bg-#18181B/20">
      <DestylerSliderRange class="absolute h-full dark:bg-#FAFAFA bg-#18181B" />
    </DestylerSliderTrack>
    <DestylerSliderThumb class="block h-4 w-4 rounded-full border dark:bg-#18181B/50 dark:border-#FAFAFA/50 bg-#FFFFFF dark:bg-#09090B shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50" />
  </DestylerSliderRoot>
</template>
