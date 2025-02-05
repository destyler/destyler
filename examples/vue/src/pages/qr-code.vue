<script setup lang="ts">
  import * as qrCode from "@destyler/qr-code"
  import { normalizeProps, useMachine } from "@destyler/vue"
  import { computed, useId } from "vue"


  const [state, send] = useMachine(
    qrCode.machine({
      id: useId(),
      value: "https://github.com/destyler",
      encoding:{
        ecc:'L',
        boostEcc: false
      }
    }),
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
</template>
