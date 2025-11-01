<script setup lang="ts">
import { clipboardControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as clipboard from '../../index'
import '../style.css'

const controls = useControls(clipboardControls)

const [state, send] = useMachine(clipboard.machine({
  id: useId(),
  value: 'https://destyler.org',
}), {
  context: controls.context,
})

const api = computed(() =>
  clipboard.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <Layout>
    <main>
      <div v-bind="api.getRootProps()">
        <label v-bind="api.getLabelProps()">Copy this link</label>
        <div v-bind="api.getControlProps()">
          <input v-bind="api.getInputProps()" style="width: 100%">
          <button v-bind="api.getTriggerProps()">
            {{ api.copied ? 'Copied' : 'Copy' }}
          </button>
        </div>
        <div v-bind="api.getIndicatorProps({ copied: true })">
          Copied!
        </div>
        <div v-bind="api.getIndicatorProps({ copied: false })">
          Copy
        </div>
      </div>
    </main>
    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
