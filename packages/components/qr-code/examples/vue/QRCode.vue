<script setup lang="ts">
import { qrCodeControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as qrCode from '../../index'
import '../style.css'

const controls = useControls(qrCodeControls)

const [state, send] = useMachine(
  qrCode.machine({
    id: useId(),
  }),
  {
    context: controls.context,
  },
)

const api = computed(() => qrCode.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <div v-bind="api.getRootProps()">
        <svg v-bind="api.getFrameProps()">
          <path v-bind="api.getPatternProps()" />
        </svg>
        <div v-bind="api.getOverlayProps()">
          <img src="https://avatars.githubusercontent.com/u/143371546?s=88&v=4" alt="">
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
