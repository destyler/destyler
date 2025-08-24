<script setup lang="ts">
import * as radio from '@destyler/radio'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

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
  <div v-bind="api.getRootProps()" class="radio-root">
    <div
      v-for="opt in items"
      :key="opt.id"
      class="radio-option"
    >
      <label
        v-bind="api.getItemProps({ value: opt.id })"
        class="radio-label"
      >
        <div class="radio-wrapper">
          <input
            v-bind="api.getItemHiddenInputProps({ value: opt.id })"
            class="radio-input"
          >
          <div
            v-bind="api.getItemControlProps({ value: opt.id })"
            class="radio-control"
          />
        </div>
        <span
          v-bind="api.getItemTextProps({ value: opt.id })"
          class="radio-text"
        >
          {{ opt.label }}
        </span>
      </label>
    </div>
  </div>
</template>
