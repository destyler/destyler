<script setup lang="ts">
import { provide, ref } from 'vue'
import { RovingFocusGroup } from '../../src'

interface Props {
  as?: any
  asChild?: boolean
  loop?: boolean
  defaultValue?: string
  orientation?: any
  dir?: any
  currentTabStopId?: string | undefined
  defaultCurrentTabStopId?: string | undefined
}
const props = defineProps<Props>()

const value = ref(props.defaultValue ?? '')

provide('rovingFocusDemo', {
  value,
})
</script>

<template>
  <RovingFocusGroup
    v-bind="props"
    class="inline-flex gap-4 p-2"
    :class="orientation === 'vertical' ? 'flex-col' : 'flex-row'"
  >
    <slot />
  </RovingFocusGroup>
</template>

<style scoped>
.inline-flex {
  display: inline-flex;
}

.gap-4 {
  gap: 1rem; /* 16px */
}

.p-2 {
  padding: 0.5rem; /* 8px */
}

.flex-col{
  flex-direction: column;
}

.flex-row{
  flex-direction: row;
}
</style>
