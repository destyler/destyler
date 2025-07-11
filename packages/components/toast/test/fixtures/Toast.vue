<script setup lang="ts">
import { StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as toast from '../../index'

const [state, send] = useMachine(toast.machine({ id: useId() }))
const api = computed(() =>
  toast.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()">
    Toast Component
  </div>

  <Toolbar>
    <StateVisualizer :state="state" />
  </Toolbar>
</template>
