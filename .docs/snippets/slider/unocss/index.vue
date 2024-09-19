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
    relative="~"
    flex="~"
    w="60%"
    touch="none"
    select="none"
    items="center"
  >
    <SliderTrack
      relative="~"
      h="2"
      w="full"
      grow="~"
      overflow="hidden"
      rounded="full"
      bg="secondary"
    >
      <SliderRange
        absolute="~"
        h="full"
        bg="primary"
      />
    </SliderTrack>
    <SliderThumb
      block="~"
      h="5"
      w="5"
      rounded="full"
      border="2 primary"
      bg="background"
      ring-offset="background"
      transition="colors"
      focus-visible="outline-none ring-2 ring-ring ring-offset-2"
      pointer-events="disabled:none"
      op="disabled:50"
    />
  </SliderRoot>
</template>
