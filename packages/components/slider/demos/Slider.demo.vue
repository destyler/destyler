<script setup lang="ts">
import { ref } from 'vue'
import { DestylerSliderRange, DestylerSliderRoot, DestylerSliderThumb, DestylerSliderTrack } from '../src'

const sliderValue = ref([50])
</script>

<template>
  <DestylerSliderRoot
    v-model="sliderValue"
    name="slider"
  >
    <DestylerSliderTrack>
      <DestylerSliderRange />
    </DestylerSliderTrack>
    <DestylerSliderThumb/>
  </DestylerSliderRoot>
</template>
