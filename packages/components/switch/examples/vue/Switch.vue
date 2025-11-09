<script setup lang="ts">
import { switchControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as switchs from '../../index'
import '../style.css'

const controls = useControls(switchControls)

const [state, send] = useMachine(
  switchs.machine({
    name: 'switch',
    id: useId(),
  }),
  { context: controls.context },
)

const api = computed(() => switchs.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <label v-bind="api.getRootProps()">
        <input v-bind="api.getHiddenInputProps()">
        <span v-bind="api.getControlProps()">
          <span v-bind="api.getThumbProps()" />
        </span>
        <span v-bind="api.getLabelProps()">Feature is {{ api.checked ? "enabled" : "disabled" }}</span>
      </label>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
