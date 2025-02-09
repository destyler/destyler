<script setup lang="ts">
import * as qrCode from "@destyler/qr-code"
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed, useId } from "vue"
import { qrCodeControls } from '@destyler/shared'
import { useControls } from '../composables/useControls'

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
  <div v-bind="api.getRootProps()" class="w-270px h-270px">
    <svg v-bind="api.getFrameProps()" class="w-270px h-270px">
      <path v-bind="api.getPatternProps()" />
    </svg>
    <div v-bind="api.getOverlayProps()" class="w-50px h-50px">
      <img
        src="https://github.com/destyler.png"
        alt=""
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
