<script setup lang="ts">
import * as progress from '@destyler/progress'
import { progressControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const controls = useControls(progressControls)

const [state, send] = useMachine(progress.machine({ id: useId(), value: 30 }), {
  context: controls.context,
})

const api = computed(() =>
  progress.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()" class="max-w-md p-6">
    <div v-bind="api.getLabelProps()" class="text-lg font-semibold mb-2 text-gray-800">
      Upload progress
    </div>
    <div
      v-bind="api.getTrackProps()"
      class="w-full h-4 bg-gray-200 rounded-full overflow-hidden"
    >
      <div
        v-bind="api.getRangeProps()"
        class="h-full bg-black transition-all duration-300 ease-out rounded-full"
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
