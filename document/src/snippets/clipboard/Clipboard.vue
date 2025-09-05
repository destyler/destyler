<script setup lang="ts">
import * as clipboard from '@destyler/clipboard'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '../../styles/components/clipboard.css'

const [state, send] = useMachine(
  clipboard.machine({
    id: useId(),
    value: 'https://github.com/destyler/destyler',
  }),
)

const api = computed(() =>
  clipboard.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()">
    <label v-bind="api.getLabelProps()">
      Copy Link
    </label>
    <div v-bind="api.getControlProps()">
      <input v-bind="api.getInputProps()" readonly>
      <button v-bind="api.getTriggerProps()">
        <div />
      </button>
    </div>
  </div>
</template>
