<script setup lang="ts">
import * as radio from '@destyler/radio'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@docs/styles/components/radio.css'

const items = [
  { id: 'default', label: 'Default' },
  { id: 'comfortable', label: 'Comfortable' },
  { id: 'compact', label: 'Compact' },
]

const [state, send] = useMachine(radio.machine({
  id: useId(),
  value: 'default',
}))

const api = computed(() => radio.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div
      v-for="opt in items"
      :key="opt.id"
      class="flex items-center space-x-3 mt-0!"
    >
      <label v-bind="api.getItemProps({ value: opt.id })">
        <div class="relative">
          <input v-bind="api.getItemHiddenInputProps({ value: opt.id })">
          <div v-bind="api.getItemControlProps({ value: opt.id })" />
        </div>
        <span v-bind="api.getItemTextProps({ value: opt.id })">
          {{ opt.label }}
        </span>
      </label>
    </div>
  </div>
</template>
