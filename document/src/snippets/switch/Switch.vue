<script setup lang="ts">
import * as switchs from '@destyler/switch'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '../../styles/components/switch.css'

const [state, send] = useMachine(switchs.machine({
  id: useId(),
  checked: true,
}))

const api = computed(() =>
  switchs.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <label v-bind="api.getRootProps()">
    <input v-bind="api.getHiddenInputProps()">
    <span v-bind="api.getControlProps()">
      <span v-bind="api.getThumbProps()" />
    </span>
  </label>
</template>
