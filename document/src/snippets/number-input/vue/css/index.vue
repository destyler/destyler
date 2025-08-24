<script setup lang="ts">
import * as numberInput from '@destyler/number-input'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(numberInput.machine({
  id: useId(),
  value: '66',
  allowMouseWheel: true,
}))
const api = computed(() =>
  numberInput.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div
    class="number-input"
    v-bind="api.getRootProps()"
  >
    <div class="number-input-container">
      <button
        class="number-input-button"
        v-bind="api.getDecrementTriggerProps()"
      >
        <span class="number-input-button-text">-</span>
      </button>
      <input
        class="number-input-field"
        v-bind="api.getInputProps()"
      >
      <button
        class="number-input-button"
        v-bind="api.getIncrementTriggerProps()"
      >
        <span class="number-input-button-text">+</span>
      </button>
    </div>
  </div>
</template>
