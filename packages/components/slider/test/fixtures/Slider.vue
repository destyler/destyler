<script setup lang="ts">
import { StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as slider from '../../index'

const [state, send] = useMachine(slider.machine({ id: useId() }))
const api = computed(() =>
  slider.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()">
    Slider Component
  </div>

  <Toolbar>
    <StateVisualizer :state="state" />
  </Toolbar>
</template>
