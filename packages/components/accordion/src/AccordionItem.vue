<script setup lang="ts">
import type { Ref } from 'vue'
import { inject } from 'vue'
import { destylerAccordion } from './keys'
import type { DestylerAccordionItemProps } from './props'

defineOptions({
  name: 'DestylerAccordionItem',
})

const { value, disabled } = withDefaults(defineProps<DestylerAccordionItemProps>(), {
  disabled: false,
})

const { modelValue, handleUpdateModelValue } = inject(destylerAccordion) as {
  modelValue: Ref<string>
  handleUpdateModelValue: (value: string) => void
}

function handleSelected() {
  if (!disabled)
    handleUpdateModelValue(modelValue.value === value ? '' : value)
}
</script>

<template>
  <div :accordion-item-status="modelValue === value" :accordion-item-disabled="disabled">
    <div accordion-item-header @click="handleSelected">
      <slot name="header" />
    </div>
    <div v-show="modelValue === value" accordion-item-content>
      <slot name="conter" />
    </div>
  </div>
</template>
