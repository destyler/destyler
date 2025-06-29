<script setup lang="ts">
import * as label from '@destyler/label'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(label.machine({ id: useId() }))

const api = computed(() => label.connect(state.value, send, normalizeProps))
</script>

<template>
  <label v-bind="api.getRootProps()">
    text
  </label>
  <Toolbar>
    <StateVisualizer :state="state" />
  </Toolbar>
</template>
