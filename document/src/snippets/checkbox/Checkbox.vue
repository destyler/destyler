<script setup lang="ts">
import * as checkbox from '@destyler/checkbox'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '../../styles/components/checkbox.css'

const [state, send] = useMachine(checkbox.machine({
  id: useId(),
}))

const api = computed(() =>
  checkbox.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <label v-bind="api.getRootProps()">
    <div v-bind="api.getControlProps()">
      <div v-if="api.checked" />
    </div>
    <span v-bind="api.getLabelProps()">
      Input is {{ api.checked ? 'checked' : 'unchecked' }}
    </span>

    <input v-bind="api.getHiddenInputProps()">
  </label>
</template>
