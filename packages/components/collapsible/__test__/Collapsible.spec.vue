<script setup lang="ts">
import { useEmitAsProps } from '@destyler/composition'
import { DestylerCollapsibleContent, DestylerCollapsibleRoot, DestylerCollapsibleTrigger } from '../src'

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
  <DestylerCollapsibleRoot v-bind="{ ...props, ...useEmitAsProps(emits) }">
    <DestylerCollapsibleTrigger>Trigger</DestylerCollapsibleTrigger>
    <DestylerCollapsibleContent>Content</DestylerCollapsibleContent>
  </DestylerCollapsibleRoot>
</template>
