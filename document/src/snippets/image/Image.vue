<script setup lang="ts">
import * as image from '@destyler/image'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '../../styles/components/image.css'

const [state, send] = useMachine(image.machine({ id: useId() }))

const api = computed(() => image.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()">
    <img
      alt="Destyler UI"
      src="https://github.com/destyler.png"
      v-bind="api.getImageProps()"
    >
    <div v-bind="api.getFallbackProps()">
      EH
    </div>
  </div>
</template>
