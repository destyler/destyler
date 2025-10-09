<script setup lang="ts">
import * as dynamic from '@destyler/dynamic'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './style.css'

const [state, send] = useMachine(
  dynamic.machine({
    id: useId(),
    value: ['Vue', 'Destyler'],
  }),
)
const api = computed(() =>
  dynamic.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div class="flex flex-wrap gap-2 mb-4">
      <span
        v-for="(value, index) in api.value"
        :key="index"
        v-bind="api.getItemProps({ index, value })"
      >
        <div v-bind="api.getItemPreviewProps({ index, value })">
          <span>{{ value }}</span>
          <button v-bind="api.getItemDeleteTriggerProps({ index, value })" />
        </div>
        <input v-bind="api.getItemInputProps({ index, value })">
      </span>
    </div>
    <div class="relative">
      <input placeholder="Add Tag..." v-bind="api.getInputProps()">
    </div>
  </div>
</template>
