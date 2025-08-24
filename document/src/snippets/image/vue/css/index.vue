<script setup lang="ts">
import * as image from '@destyler/image'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './index.css'

const [state, send] = useMachine(image.machine({ id: useId() }))

const api = computed(() => image.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()" class="root">
    <img
      alt="EH"
      src="https://github.com/destyler.png"
      v-bind="api.getImageProps()"
      class="image"
    >
    <div
      v-bind="api.getFallbackProps()"
      class="fallback"
    >
      EH
    </div>
  </div>
</template>
