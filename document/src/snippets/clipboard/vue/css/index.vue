<script setup lang="ts">
import * as clipboard from '@destyler/clipboard'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './index.css'


const [state, send] = useMachine(
  clipboard.machine({
    id: useId(),
    value: 'https://github.com/destyler/destyler',
  })
)

const api = computed(() =>
  clipboard.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()" class="clipboard-root">
    <label v-bind="api.getLabelProps()" class="clipboard-label">
      Copy Link
    </label>
    <div v-bind="api.getControlProps()" class="clipboard-control">
      <div class="clipboard-input-wrapper">
        <input
          v-bind="api.getInputProps()"
          class="clipboard-input"
          readonly
        >
      </div>
      <button
        v-bind="api.getTriggerProps()"
        class="clipboard-trigger"
      >
        <div v-if="api.copied" class="clipboard-icon-copied i-carbon:checkmark" />
        <div v-else class="clipboard-icon-copy i-carbon:copy" />
      </button>
    </div>
  </div>
</template>
