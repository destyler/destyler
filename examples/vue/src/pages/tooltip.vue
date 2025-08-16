<script setup lang="ts">
import { StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import * as tooltip from '@destyler/tooltip'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/tooltip.css'

const [state, send] = useMachine(tooltip.machine({ id: useId() }))
const api = computed(() => tooltip.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="tooltip-root">
    <button
      v-bind="api.getTriggerProps()"
      class="tooltip-trigger"
    >
      Hover me
    </button>
    <div v-bind="api.getPositionerProps()" class="tooltip-positioner">
      <div
        v-bind="api.getContentProps()"
        class="tooltip-content"
      >
        Tooltip
      </div>
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
  </Toolbar>
</template>
