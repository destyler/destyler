<script setup lang="ts">
import type { DestylerButtonProps } from './props'

defineOptions({
  name: 'DestylerButton',
})

const { attrType, focusable, disabled } = withDefaults(defineProps<DestylerButtonProps>(), {
  attrType: 'button',
  focusable: false,
  disabled: false,
})
</script>

<template>
  <button
    destyler-button
    :type="attrType"
    :autofocus="focusable"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
