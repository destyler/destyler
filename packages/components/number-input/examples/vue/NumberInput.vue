<script setup lang="ts">
import { numberInputControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as numberInput from '../../index'
import '../style.css'

const controls = useControls(numberInputControls)

const [state, send] = useMachine(numberInput.machine({
  id: useId(),
}), {
  context: controls.context,
})

const api = computed(() => numberInput.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <div v-bind="api.getRootProps()">
        <div data-testid="scrubber" v-bind="api.getScrubberProps()" />
        <label data-testid="label" v-bind="api.getLabelProps()"> Enter number </label>
        <div v-bind="api.getControlProps()">
          <button data-testid="dec-button" v-bind="api.getDecrementTriggerProps()">
            DEC
          </button>
          <input data-testid="input" v-bind="api.getInputProps()">
          <button data-testid="inc-button" v-bind="api.getIncrementTriggerProps()">
            INC
          </button>
        </div>
      </div>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" :omit="['formatter', 'parser']" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
