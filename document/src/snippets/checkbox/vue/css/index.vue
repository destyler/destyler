<script setup lang="ts">
import * as checkbox from '@destyler/checkbox'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './index.css'

const [state, send] = useMachine(checkbox.machine({ id: useId() }))

const api = computed(() =>
  checkbox.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <label v-bind="api.getRootProps()" class="root">
    <div v-bind="api.getControlProps()" class="checkbox-control">
      <div v-if="api.checked" class="checkbox-icon" />
    </div>
    <span v-bind="api.getLabelProps()" class="checkbox-label">
      Input is
      <span v-if="api.checked"> checked</span>
      <span v-else> unchecked</span>
    </span>

    <input v-bind="api.getHiddenInputProps()">
  </label>
</template>
