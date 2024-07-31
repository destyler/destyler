<script setup lang="ts">
import { provide, ref } from 'vue'
import { RovingFocusGroup } from '../src'

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
  >
    <slot />
  </RovingFocusGroup>
</template>
