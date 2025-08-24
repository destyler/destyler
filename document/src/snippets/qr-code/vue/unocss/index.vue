<script setup lang="ts">
import * as qrCode from '@destyler/qr-code'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

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
  <div v-bind="api.getRootProps()" class="size-135px">
    <svg v-bind="api.getFrameProps()" class="size-135px bg-background">
      <path v-bind="api.getPatternProps()" class="fill-primary" />
    </svg>
  </div>
</template>
