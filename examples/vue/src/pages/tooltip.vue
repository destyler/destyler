<script setup lang="ts">
import { StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import * as tooltip from '@destyler/tooltip'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed } from 'vue'
import '@destyler/shared-private/styles/tooltip.css'

const id1 = 'tip-1'
const id2 = 'tip-2'

const [state1, send1] = useMachine(tooltip.machine({ id: id1 }))
const api1 = computed(() => tooltip.connect(state1.value, send1, normalizeProps))

const [state2, send2] = useMachine(tooltip.machine({ id: id2 }))
const api2 = computed(() => tooltip.connect(state2.value, send2, normalizeProps))
</script>

<template>
  <div data-testid="focus">
    focus
  </div>
  <div class="tooltip-root">
    <button
      v-bind="api1.getTriggerProps()"
      class="tooltip-trigger"
      :data-testid="`${id1}-trigger`"
    >
      Hover me
    </button>
    <div v-bind="api1.getPositionerProps()" class="tooltip-positioner">
      <div
        v-bind="api1.getContentProps()"
        class="tooltip-content"
        :data-testid="`${id1}-tooltip`"
      >
        Tooltip 1
      </div>
    </div>
  </div>
  <div class="tooltip-root">
    <button
      v-bind="api2.getTriggerProps()"
      class="tooltip-trigger"
      :data-testid="`${id2}-trigger`"
    >
      Over me
    </button>
    <div v-bind="api2.getPositionerProps()" class="tooltip-positioner">
      <div
        v-bind="api2.getContentProps()"
        class="tooltip-content"
        :data-testid="`${id2}-tooltip`"
      >
        Tooltip 2
      </div>
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state1" label="Tooltip 1" />
    <StateVisualizer :state="state2" label="Tooltip 2" />
  </Toolbar>
</template>
