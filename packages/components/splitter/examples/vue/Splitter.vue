<script setup lang="ts">
import { splitterControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as splitter from '../../index'
import '../style.css'

const controls = useControls(splitterControls)

const [state, send] = useMachine(
  splitter.machine({
    id: useId(),
    size: [
      { id: 'a', size: 50 },
      { id: 'b', size: 50 },
    ],
  }),
  {
    context: controls.context,
  },
)

const api = computed(() => splitter.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main style="min-width: 400px;min-height: 200px;">
      <div v-bind="api.getRootProps()">
        <div v-bind="api.getPanelProps({ id: 'a' })">
          <p>A</p>
        </div>
        <div v-bind="api.getResizeTriggerProps({ id: 'a:b' })" />
        <div v-bind="api.getPanelProps({ id: 'b' })">
          <p>B</p>
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
