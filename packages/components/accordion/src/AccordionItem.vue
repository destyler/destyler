<script setup lang="ts">
import { selected } from './composition'
import type { DestylerAccordionItemProps } from './props'

defineOptions({
  name: 'DestylerAccordionItem',
})

const { value } = defineProps<DestylerAccordionItemProps>()
</script>

<template>
  <div>
    <div accordion-item-header @click="selected = value">
      <slot name="header" />
    </div>
    <div v-show="selected === value" accordion-item-content>
      <slot name="conter" />
    </div>
  </div>
</template>
