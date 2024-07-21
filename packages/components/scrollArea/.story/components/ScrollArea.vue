<script setup lang="ts">
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '../../src'
import ScrollAreaCopy from './ScrollAreaCopy.vue'

interface Props {
  type?: any | undefined
  dir?: any | undefined
  scrollHideDelay?: number | undefined
  as?: any | undefined
  asChild?: boolean | undefined
}

const props = defineProps<Props>()
</script>

<template>
  <ScrollAreaRoot
    style="width: 200px; height: 200px; overflow: hidden;"
    v-bind="props"
  >
    <ScrollAreaViewport style="width: 100%; height: 100%;">
      <ScrollAreaCopy style="width: 50px;" />
      <ScrollAreaCopy style="width: 50px;" />
    </ScrollAreaViewport>
    <ScrollAreaScrollbar
      orientation="vertical"
    >
      <ScrollAreaThumb />
    </ScrollAreaScrollbar>

    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
