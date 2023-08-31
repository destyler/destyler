<script setup lang="ts">
import { onMounted } from 'vue'
import { selected } from './composition'
import type { DestylerAccordionRootProps } from './props'

defineOptions({
  name: 'DestylerAccordion',
})

const { defaultValue } = defineProps<DestylerAccordionRootProps>()

onMounted(() => {
  selected.value = defaultValue
})
</script>

<template>
  <div>
    <slot />
  </div>
</template>
