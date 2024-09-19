<script setup lang="ts">
import { ref } from 'vue'
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from '@destyler/slider'
import './style.css'

const value = ref([50])
</script>

<template>
  <SliderRoot
    v-model="value"
    :max="100"
    :step="1"
    class="slider-root"
  >
    <SliderTrack class="slider-track">
      <SliderRange class="slider-range" />
    </SliderTrack>
    <SliderThumb class="slider-thumb" />
  </SliderRoot>
</template>
