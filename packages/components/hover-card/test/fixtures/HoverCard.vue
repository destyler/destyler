<script setup lang="ts">
import { StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as hoverCard from '../../index'

const [state, send] = useMachine(hoverCard.machine({ id: useId() }))
const api = computed(() =>
  hoverCard.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()">
    HoverCard Component
  </div>

  <Toolbar>
    <StateVisualizer :state="state" />
  </Toolbar>
</template>
