<script setup lang="ts">
import * as label from '@destyler/label'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '../../styles/components/label.css'

const [state, send] = useMachine(label.machine({ id: useId() }))

const api = computed(() => label.connect(state.value, send, normalizeProps))
</script>

<template>
  <div>
    <label v-bind="api.getRootProps()">
      First name
    </label>
    <input id="firstName" type="text" value="Elone Hoo">
  </div>
</template>
