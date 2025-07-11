<script setup lang="ts">
import { StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as tabs from '../../index'

const [state, send] = useMachine(tabs.machine({ id: useId() }))
const api = computed(() =>
  tabs.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()">
    Tabs Component
  </div>

  <Toolbar>
    <StateVisualizer :state="state" />
  </Toolbar>
</template>
