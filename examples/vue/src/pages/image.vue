<script setup lang="ts">
import * as image from '@destyler/image'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/image.css'

const [state, send] = useMachine(image.machine({ id: useId() }))

const api = computed(() => image.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()" class="image-root">
    <div v-bind="api.getFallbackProps()" class="image-fallback">
      EH
    </div>
    <img
      alt="EH"
      src="https://github.com/elonehoo.png"
      v-bind="api.getImageProps()"
      class="image-img"
    >
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
  </Toolbar>
</template>
