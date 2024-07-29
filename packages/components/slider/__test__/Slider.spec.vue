<script setup lang="ts">
import { ref } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from '../src'

const props = defineProps<{
  name?: string | undefined
  defaultValue?: number[] | undefined
  modelValue?: number[] | undefined
  disabled?: boolean | undefined
  orientation?: any | undefined
  dir?: any | undefined
  inverted?: any | undefined
  min?: number | undefined
  max?: number | undefined
  step?: number | undefined
  minStepsBetweenThumbs?: number | undefined
  as?: any | undefined
  asChild?: boolean | undefined
}>()

const emits = defineEmits(['update:modelValue', 'valueCommit'])

const sliderValue = ref([50])

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <SliderRoot
    v-bind="forwarded"
    v-model="sliderValue"
    name="slider"
  >
    <SliderTrack>
      <SliderRange />
    </SliderTrack>
    <SliderThumb/>
  </SliderRoot>
</template>
