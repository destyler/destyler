<script setup lang="ts">
import { StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as select from '../../index'

const [state, send] = useMachine(select.machine({ id: useId() }))
const api = computed(() =>
  select.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()">
    Select Component
  </div>

  <Toolbar>
    <StateVisualizer :state="state" />
  </Toolbar>
</template>
