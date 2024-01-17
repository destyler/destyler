<script setup lang="ts">
import { ref } from 'vue'
import { DestylerSliderRange, DestylerSliderRoot, DestylerSliderThumb, DestylerSliderTrack } from '@destyler/slider'

const sliderValue = ref([50])
</script>

<template>
  {{ sliderValue }}
  <DestylerSliderRoot
    v-model="sliderValue"
    name="slider"
  >
    <DestylerSliderTrack>
      <DestylerSliderRange />
    </DestylerSliderTrack>
    <DestylerSliderThumb />
  </DestylerSliderRoot>
</template>
