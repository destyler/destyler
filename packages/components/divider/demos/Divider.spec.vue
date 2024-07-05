<script setup lang="ts">
import { Divider } from '../src'

const props = withDefaults(defineProps<{
  orientation?: string
  decorative?: string
}>(), {
  orientation: 'horizontal',
})
</script>

<template>
  <Divider v-bind="props">
    <slot />
  </Divider>
</template>
