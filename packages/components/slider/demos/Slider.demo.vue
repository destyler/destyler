<script setup lang="ts">
import { ref } from 'vue'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from '../src'

const sliderValue = ref([50])
</script>

<template>
  <SliderRoot
    v-model="sliderValue"
    class="relative flex touch-none select-none items-center w-60%"
    name="slider"
  >
    <SliderTrack class="relative h-1.5 w-full grow overflow-hidden rounded-full dark:bg-#FAFAFA/20 bg-#18181B/20">
      <SliderRange class="absolute h-full dark:bg-#FAFAFA bg-#18181B" />
    </SliderTrack>
    <SliderThumb class="block h-4 w-4 rounded-full border dark:border-#18181B/50 dark:border-#FAFAFA/50 bg-#FFFFFF dark:bg-#09090B shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50" />
  </SliderRoot>
</template>
