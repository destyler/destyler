<script setup lang="ts">
import * as dynamic from '@destyler/dynamic'
import { dynamicControls } from '@destyler/shared-private'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

import { useControls } from '../composables/useControls'

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
</script>

<template>
  <div v-bind="api.getRootProps()" class="max-w-md p-6">
    <div class="flex flex-wrap gap-2 mb-4">
      <span
        v-for="(value, index) in api.value"
        :key="index"
        v-bind="api.getItemProps({ index, value })"
        class="relative group"
      >
        <div
          v-bind="api.getItemPreviewProps({ index, value })"
          class="bg-gray-100 text-gray-900 rounded-lg px-3 py-1 flex items-center gap-2"
        >
          <span class="text-sm font-medium">{{ value }}</span>
          <button
            v-bind="api.getItemDeleteTriggerProps({ index, value })"
            class="text-gray-600 hover:text-gray-900 transition-colors text-xs"
          >
            &#x2715;
          </button>
        </div>
        <input
          v-bind="api.getItemInputProps({ index, value })"
          class="hidden absolute left-0 top-0 w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
        >
      </span>
    </div>
    <input
      placeholder="Add tag..."
      v-bind="api.getInputProps()"
      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none placeholder-gray-500"
    >
  </div>

  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
