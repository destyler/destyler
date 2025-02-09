<script setup lang="ts">
import * as aspectRatio from '@destyler/aspect-ratio'
import { aspectRatioControls } from '@destyler/shared'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useControls } from '../composables/useControls'

const controls = useControls(aspectRatioControls)

const [state, send] = useMachine(aspectRatio.machine({ id: useId() }), {
  context: controls.context,
})
const api = computed(() =>
  aspectRatio.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <main>
    <div class="w-full sm:w-75 overflow-hidden rounded-md">
      <div v-bind="api.getRootProps()">
        <div v-bind="api.getContentProps()">
          <img
            class="h-full w-full object-cover"
            src="https://elonehoo.me/gallery/20_sun.jpg"
          >
        </div>
      </div>
    </div>
  </main>

  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
