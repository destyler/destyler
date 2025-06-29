<script setup lang="ts">
import { StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import * as tooltip from '@destyler/tooltip'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(tooltip.machine({ id: useId() }))
const api = computed(() => tooltip.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="">
    <button
      v-bind="api.getTriggerProps()"
      class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
    >
      Hover me
    </button>
    <div v-bind="api.getPositionerProps()" class="z-50">
      <div
        v-bind="api.getContentProps()"
        class="px-3 py-2 bg-white text-gray-900 rounded-md shadow-lg border border-gray-200 text-sm transition-opacity duration-200"
      >
        Tooltip
      </div>
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
  </Toolbar>
</template>
