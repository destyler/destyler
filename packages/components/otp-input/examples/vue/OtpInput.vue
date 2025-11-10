<script setup lang="ts">
import { otpInputControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as otpInput from '../../index'
import '../style.css'

const controls = useControls(otpInputControls)

const [state, send] = useMachine(
  otpInput.machine({
    id: useId(),
    name: 'test',
  }),
  { context: controls.context },
)

const api = computed(() => otpInput.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <div v-bind="api.getRootProps()">
        <label v-bind="api.getLabelProps()">Enter code:</label>
        <div v-bind="api.getControlProps()">
          <input data-testid="input-1" v-bind="api.getInputProps({ index: 0 })">
          <input data-testid="input-2" v-bind="api.getInputProps({ index: 1 })">
          <input data-testid="input-3" v-bind="api.getInputProps({ index: 2 })">
        </div>
        <input v-bind="api.getHiddenInputProps()">
      </div>
      <button data-testid="clear-button" @click="api.clearValue">
        Clear
      </button>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
