<script setup lang="ts">
import * as numberInput from '@destyler/number-input'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '../../styles/components/number-input.css'

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
  <div v-bind="api.getRootProps()">
    <button v-bind="api.getDecrementTriggerProps()">
      <span>-</span>
    </button>
    <input v-bind="api.getInputProps()">
    <button v-bind="api.getIncrementTriggerProps()">
      <span>+</span>
    </button>
  </div>
</template>
