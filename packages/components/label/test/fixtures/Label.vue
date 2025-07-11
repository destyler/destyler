<script setup lang="ts">
import { StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as label from '../../index'

const [state, send] = useMachine(label.machine({ id: useId() }))
const api = computed(() =>
  label.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <label v-bind="api.getRootProps()">
    Test Label
  </label>

  <Toolbar>
    <StateVisualizer :state="state" />
  </Toolbar>
</template>
