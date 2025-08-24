<script setup lang="ts">
import * as dynamic from '@destyler/dynamic'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './index.css'

const [state, send] = useMachine(
  dynamic.machine({
    id: useId(),
    value: ['React', 'Vue'],
  }),
)
const api = computed(() =>
  dynamic.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()" class="dynamic-root">
    <div class="dynamic-tag-container">
      <span
        v-for="(value, index) in api.value"
        :key="index"
        v-bind="api.getItemProps({ index, value })"
        class="dynamic-tag-item"
      >
        <div
          v-bind="api.getItemPreviewProps({ index, value })"
          class="dynamic-tag-preview"
        >
          <span class="dynamic-tag-name">{{ value }}</span>
          <button
            v-bind="api.getItemDeleteTriggerProps({ index, value })"
            class="dynamic-delete-button"
          />
        </div>
        <input
          v-bind="api.getItemInputProps({ index, value })"
          class="dynamic-tag-input"
        >
      </span>
    </div>
    <div class="dynamic-input-container">
      <input
        placeholder="Add Tag..."
        v-bind="api.getInputProps()"
        class="dynamic-input"
      >
    </div>
  </div>
</template>
