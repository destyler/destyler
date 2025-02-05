<script setup lang="ts">
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed, useId } from "vue"

const [state, send] = useMachine(aspectRatio.machine({ id: useId(), ratio: 16 / 9 }))
const api = computed(() =>
  aspectRatio.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div class="w-full sm:w-200 overflow-hidden">
    <div v-bind="api.getRootProps()">
      <div v-bind="api.getContentProps()">
        <img
          class="h-full w-full object-cover"
          src="https://elonehoo.me/gallery/20_sun.jpg"
        >
      </div>
    </div>
  </div>

</template>
