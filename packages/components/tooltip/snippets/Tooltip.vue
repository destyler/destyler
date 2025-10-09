<script setup lang="ts">
import * as tooltip from '@destyler/tooltip'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './style.css'

const [state, send] = useMachine(tooltip.machine({
  id: useId(),
  openDelay: 300,
  closeDelay: 100,
}))
const api = computed(() => tooltip.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="flex items-center justify-center min-h-[200px] mt-0!">
    <button v-bind="api.getTriggerProps()">
      Hover me
    </button>
    <div v-bind="api.getPositionerProps()">
      <div v-bind="api.getContentProps()">
        This is a tooltip following the mouse cursor.
      </div>
    </div>
  </div>
</template>
