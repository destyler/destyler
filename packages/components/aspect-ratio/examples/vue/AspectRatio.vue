<script setup lang="ts">
import { aspectRatioControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as aspectRatio from '../../index'
import '../style.css'

const controls = useControls(aspectRatioControls)

const [state, send] = useMachine(aspectRatio.machine({ id: useId() }), {
  context: controls.context,
})
const api = computed(() =>
  aspectRatio.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <Layout>
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

    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
