<script setup lang="ts">
import * as qrCode from '@destyler/qr-code'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '../../styles/components/qr-code.css'

const [state, send] = useMachine(
  qrCode.machine({
    id: useId(),
    value: 'https://destyler.org',
    encoding: {
      ecc: 'H',
    },
  }),
)

const api = computed(() => qrCode.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()">
    <svg v-bind="api.getFrameProps()">
      <path v-bind="api.getPatternProps()" />
    </svg>
  </div>
</template>
