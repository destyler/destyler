<script setup lang="ts">
import { selected } from './composition'
import type { DestylerAccordionItemProps } from './props'

defineOptions({
  name: 'DestylerAccordionItem',
})

const { value, disabled } = withDefaults(defineProps<DestylerAccordionItemProps>(), {
  disabled: false,
})

function handleSelected() {
  if (!disabled)
    selected.value = selected.value === value ? '' : value
}
</script>

<template>
  <div :accordion-item-status="selected === value" :accordion-item-disabled="disabled">
    <div accordion-item-header @click="handleSelected">
      <slot name="header" />
    </div>
    <div v-show="selected === value" accordion-item-content>
      <slot name="conter" />
    </div>
  </div>
</template>
