<script setup lang="ts">
import { DestylerDivider } from '../src'

const props = withDefaults(defineProps<{
  orientation?: string
  decorative?: string
}>(), {
  orientation: 'horizontal',
})
</script>

<template>
  <DestylerDivider v-bind="props">
    <slot />
  </DestylerDivider>
</template>
