<script setup lang="ts">
import { ref } from 'vue'
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from '@destyler/slider'

const value = ref([50])
</script>

<template>
  <SliderRoot
    v-model="value"
    :max="100"
    :step="1"
    class="relative flex w-60% touch-none select-none items-center"
  >
    <SliderTrack class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderRange class="absolute h-full bg-primary" />
    </SliderTrack>
    <SliderThumb class="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderRoot>
</template>
