<script setup lang="ts">
import { ref } from 'vue'
import { DestylerSliderRange, DestylerSliderRoot, DestylerSliderThumb, DestylerSliderTrack } from '@destyler/slider'

const sliderValue = ref([50])
</script>

<template>
  {{ sliderValue }}
  <DestylerSliderRoot
    v-model="sliderValue"
    class="SliderRoot"
    name="slider"
  >
    <DestylerSliderTrack class="SliderTrack">
      <DestylerSliderRange class="SliderRange" />
    </DestylerSliderTrack>
    <DestylerSliderThumb class="SliderThumb" />
  </DestylerSliderRoot>
</template>

<style>
.SliderRoot {
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
  width: 200px;
  height: 20px;
}

.SliderTrack {
  background-color: black;
  position: relative;
  flex-grow: 1;
  border-radius: 9999px;
  height: 3px;
}

.SliderRange {
  position: absolute;
  background-color: white;
  border-radius: 9999px;
  height: 100%;
}

.SliderThumb {
  display: block;
  width: 20px;
  height: 20px;
  background-color: white;
  box-shadow: 0 2px 10px black;
  border-radius: 10px;
}
.SliderThumb:hover {
  background-color: gray;
}
.SliderThumb:focus {
  outline: none;
  box-shadow: 0 0 0 5px black;
}
</style>
