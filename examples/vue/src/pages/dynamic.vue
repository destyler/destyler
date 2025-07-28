<script setup lang="ts">
import * as dynamic from '@destyler/dynamic'
import { dynamicControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

import '@destyler/shared-private/styles/dynamic.css'

const controls = useControls(dynamicControls)

const [state, send] = useMachine(
  dynamic.machine({
    id: useId(),
    value: ['React', 'Vue'],
  }),
  {
    context: controls.context,
  },
)
const api = computed(() =>
  dynamic.connect(state.value, send, normalizeProps),
)

function toDashCase(str: string) {
  return str.replace(/\s+/g, '-').toLowerCase()
}
</script>

<template>
  <div v-bind="api.getRootProps()" class="dynamic-root">
    <div class="dynamic-content">
      <span
        v-for="(value, index) in api.value"
        :key="index"

        v-bind="api.getItemProps({ index, value })"
        class="group"
        style="position: relative;"
      >
        <div
          :data-testid="`${toDashCase(value)}-input`"
          v-bind="api.getItemPreviewProps({ index, value })"
          class="dynamic-item-preview"
        >
          <span class="dynamic-item-preview-value">{{ value }}</span>
          <button
            v-bind="api.getItemDeleteTriggerProps({ index, value })"
            class="dynamic-item-delete-trigger"
            :data-testid="`${toDashCase(value)}-delete-trigger`"
          >
            &#x2715;
          </button>
        </div>
        <input
          v-bind="api.getItemInputProps({ index, value })"
          :data-testid="`${toDashCase(value)}-item-input`"
        >
      </span>
    </div>
    <input
      placeholder="Add tag..."
      v-bind="api.getInputProps()"
      class="dynamic-input"
    >
  </div>

  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
