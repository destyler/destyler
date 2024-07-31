<script setup lang="ts">
import { useEmitAsProps } from '@destyler/composition'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from '../src'

const props = withDefaults(defineProps<{
  open?: boolean
  defaultOpen?: boolean
}>(), {
  open: undefined,
  defaultOpen: false,
})
const emits = defineEmits(['update:open'])
</script>

<template>
  <CollapsibleRoot v-bind="{ ...props, ...useEmitAsProps(emits) }">
    <CollapsibleTrigger>Trigger</CollapsibleTrigger>
    <CollapsibleContent>Content</CollapsibleContent>
  </CollapsibleRoot>
</template>
