<script setup lang="ts">
import { ref } from 'vue'
import { useForwardExpose } from '@destyler/composition'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from '../src'

const sliderValue = ref([50])

useForwardExpose()
const el = ref<InstanceType<typeof SliderTrack>>()
</script>

<template>
  <Story title="Slider/Default" :layout="{ type: 'single', iframe: false }">
    <Variant title="default">
      {{ sliderValue }}
      <SliderRoot
        v-model="sliderValue"
        name="slider"
        class="relative flex items-center select-none touch-none w-[200px] h-5"
      >
        <SliderTrack ref="el" class="bg-blackA10 relative grow rounded-full h-[3px]">
          <SliderRange class="absolute bg-white rounded-full h-full" />
        </SliderTrack>
        <SliderThumb
          class="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-blackA7 rounded-[10px] hover:bg-green3 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA8"
        />
      </SliderRoot>
    </Variant>
  </Story>
</template>
