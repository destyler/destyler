<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { useForwardPropsEmits } from '@destyler/composition'
import type { ToggleGroupRootProps } from '../src/component'
import { ToggleGroupItem, ToggleGroupRoot } from '../src'

const props = defineProps<{
  as?: any
  asChild?: boolean
  type?: any
  defaultValue?: string | string[]
  modelValue?: string | string[]
  rovingFocus?: boolean
  disabled?: boolean
  orientation?: string
  dir?: string
  loop?: boolean
}>()
const emits = defineEmits(['update:modelValue'])

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ToggleGroupRoot v-bind="forwarded">
    <ToggleGroupItem
      value="left"
      aria-label="Toggle italic"
    >
      <Icon name="radix-icons:text-align-left" />
    </ToggleGroupItem>
    <ToggleGroupItem
      value="center"
      aria-label="Toggle italic"
    >
      <Icon name="radix-icons:text-align-center" />
    </ToggleGroupItem>
    <ToggleGroupItem
      value="right"
      aria-label="Toggle italic"
    >
      <Icon name="radix-icons:text-align-right" />
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
