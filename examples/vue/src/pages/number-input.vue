<script setup lang="ts">
import * as numberInput from '@destyler/number-input'
import { numberInputControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/number-input.css'

const controls = useControls(numberInputControls)

const [state, send] = useMachine(numberInput.machine({ id: useId() }), {
  context: controls.context,
})
const api = computed(() =>
  numberInput.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div
    class="number-input-root"
    v-bind="api.getRootProps()"
  >
    <label
      class="number-input-label"
      v-bind="api.getLabelProps()"
    >
      Enter number
    </label>
    <div class="number-input-action">
      <button
        class="number-input-trigger"
        data-testid="dec:trigger"
        v-bind="api.getDecrementTriggerProps()"
      >
        <span>-</span>
      </button>
      <input
        data-testid="input"
        class="number-input-input"
        v-bind="api.getInputProps()"
      >
      <button
        class="number-input-trigger"
        data-testid="inc:trigger"
        v-bind="api.getIncrementTriggerProps()"
      >
        <span>+</span>
      </button>
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
