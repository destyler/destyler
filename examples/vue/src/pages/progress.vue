<script setup lang="ts">
import * as progress from '@destyler/progress'
import { progressControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared/src/styles/components/progress.css'

const controls = useControls(progressControls)

const [state, send] = useMachine(progress.machine({ id: useId(), value: 30 }), {
  context: controls.context,
})

const api = computed(() =>
  progress.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()" class="progress-root">
    <div v-bind="api.getLabelProps()" class="progress-label">
      Upload progress
    </div>
    <div
      v-bind="api.getTrackProps()"
      class="progress-track"
    >
      <div
        v-bind="api.getRangeProps()"
        class="progress-range"
      />
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
