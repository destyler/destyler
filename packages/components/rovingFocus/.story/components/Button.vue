<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { RovingFocusItem } from '../../src'

interface Props {
  as?: any
  asChild?: boolean
  focusable?: boolean
  active?: boolean
  value: string
  disabled?: boolean
  tabStopId?: string | undefined
}
const props = defineProps<Props>()

const context = inject('rovingFocusDemo', {
  value: ref(''),
})
const isSelected = computed(() => context.value.value === props.value)
</script>

<template>
  <RovingFocusItem as-child :active="isSelected" :focusable="!disabled">
    <button
      class="border-2 border-blue-600 px-4 py-2 rounded-md"
      :class="{ 'bg-gray-900 text-white': isSelected }"
      :disabled="disabled"
      @click="context.value.value = props.value"
      @focus="
        (event: FocusEvent) => {
          if (context.value.value !== undefined) {
            (event.target as HTMLElement)?.click();
          }
        }
      "
    >
      <slot />
    </button>
  </RovingFocusItem>
</template>
