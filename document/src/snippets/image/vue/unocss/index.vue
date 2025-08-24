<script setup lang="ts">
import * as image from '@destyler/image'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(image.machine({ id: useId() }))

const api = computed(() => image.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()" class="relative mt-0! flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
    <img
      alt="EH"
      src="https://github.com/destyler.png"
      v-bind="api.getImageProps()"
      class="aspect-square h-full w-full"
    >
    <div
      v-bind="api.getFallbackProps()"
      class="flex h-full w-full items-center justify-center
      rounded-full bg-muted"
    >
      EH
    </div>
  </div>
</template>
