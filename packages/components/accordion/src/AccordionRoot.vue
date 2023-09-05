<script setup lang="ts">
import { provide } from 'vue'
import { destylerAccordion } from './keys'

defineOptions({
  name: 'DestylerAccordion',
})

const modelValue = defineModel<string>({ required: true })

provide(destylerAccordion, {
  modelValue,
  handleUpdateModelValue,
})

function handleUpdateModelValue(value: string) {
  modelValue.value = value
}
</script>

<template>
  <div accordion-item-root>
    <slot />
  </div>
</template>
