<script setup lang="ts">
import { progressControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as progress from '../../index'
import '../style.css'

const controls = useControls(progressControls)

const [state, send] = useMachine(progress.machine({
  id: useId(),
}), {
  context: controls.context,
})

const api = computed(() => progress.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <div v-bind="api.getRootProps()">
        <div v-bind="api.getLabelProps()">
          Upload progress
        </div>
        <svg v-bind="api.getCircleProps()">
          <circle v-bind="api.getCircleTrackProps()" />
          <circle v-bind="api.getCircleRangeProps()" />
        </svg>
        <div v-bind="api.getTrackProps()">
          <div v-bind="api.getRangeProps()" />
        </div>
        <div v-bind="api.getValueTextProps()">
          {{ api.valueAsString }}
        </div>
        <div>
          <button @click="() => api.setValue((api.value ?? 0) - 20)">
            Decrease
          </button>
          <button @click="() => api.setValue((api.value ?? 0) + 20)">
            Increase
          </button>
          <button @click="() => api.setValue(null)">
            Indeterminate
          </button>
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
