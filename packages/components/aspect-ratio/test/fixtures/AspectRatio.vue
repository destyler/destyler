<script setup lang="ts">
import { aspectRatioControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as aspectRatio from '../../index'

const controls = useControls(aspectRatioControls)

const [state, send] = useMachine(aspectRatio.machine({ id: useId() }), {
  context: controls.context,
})
const api = computed(() =>
  aspectRatio.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div v-bind="api.getContentProps()">
      <img
        src="https://elonehoo.me/gallery/20_sun.jpg"
      >
    </div>
  </div>

  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
