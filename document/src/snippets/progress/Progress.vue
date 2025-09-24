<script setup lang="ts">
import * as progress from '@destyler/progress'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '../../styles/components/progress.css'

const [state, send] = useMachine(progress.machine({ id: useId(), value: 30 }))

const api = computed(() =>
  progress.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div v-bind="api.getTrackProps()">
      <div v-bind="api.getRangeProps()" />
    </div>
  </div>
</template>
