<script setup lang="ts">
import * as label from '@destyler/label'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(label.machine({ id: useId() }))

const api = computed(() => label.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="label-container">
    <label
      v-bind="api.getRootProps()"
      class="label"
    >
      First name
    </label>
    <input
      id="firstName"
      class="input"
      type="text"
      value="Elone Hoo"
    >
  </div>
</template>
