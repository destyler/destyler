<script setup lang="ts">
import * as clipboard from '@destyler/clipboard'
import { clipboardControls } from '@destyler/shared'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useControls } from '../composables/useControls'

const controls = useControls(clipboardControls)

const [state, send] = useMachine(
  clipboard.machine({
    id: useId(),
    value: 'https://github.com/destyler/destyler',
  }),
  {
    context: controls.context,
  },
)

const api = computed(() =>
  clipboard.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()" class="max-w-md p-6">
    <label v-bind="api.getLabelProps()" class="block text-sm font-medium text-gray-800 mb-2">
      Copy Link
    </label>
    <div v-bind="api.getControlProps()" class="flex items-center gap-2 mt-1">
      <div class="relative flex-1">
        <input
          v-bind="api.getInputProps()"
          class="block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all"
          readonly
        >
      </div>
      <button
        v-bind="api.getTriggerProps()"
        class="inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200"
        :class="api.copied ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'"
      >
        <div v-if="api.copied" class="transform transition-transform duration-200 i-carbon:checkmark w-5 h-5" />
        <div v-else class="i-carbon:copy w-5 h-5" />
      </button>
    </div>
    <p class="mt-2 text-sm text-gray-500">
      Click the button to copy link to clipboard
    </p>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
