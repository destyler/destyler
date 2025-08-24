<script setup lang="ts">
import * as qrCode from '@destyler/qr-code'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './index.css'

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
  <div v-bind="api.getRootProps()" class="qr-root">
    <svg v-bind="api.getFrameProps()" class="qr-frame">
      <path v-bind="api.getPatternProps()" class="qr-pattern" />
    </svg>
  </div>
</template>
