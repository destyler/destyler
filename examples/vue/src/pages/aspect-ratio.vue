<script setup lang="ts">
import * as aspectRatio from '@destyler/aspect-ratio'
import { aspectRatioControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/aspect-ratio.css'

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
    <div class="aspect-ratio-root">
      <div v-bind="api.getRootProps()">
        <div v-bind="api.getContentProps()">
          <img
            class="aspect-ratio-img"
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
