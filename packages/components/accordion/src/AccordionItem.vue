<script setup lang="ts">
import { selected } from './composition'
import type { DestylerAccordionItemProps } from './props'

defineOptions({
  name: 'DestylerAccordionItem',
})

const { value } = defineProps<DestylerAccordionItemProps>()

function handleSelected() {
  if (selected.value === value)
    selected.value = ''
  else
    selected.value = value
}
</script>

<template>
  <div :accordion-item-status="selected === value">
    <div accordion-item-header @click="handleSelected">
      <slot name="header" />
    </div>
    <div v-show="selected === value" accordion-item-content>
      <slot name="conter" />
    </div>
  </div>
</template>
