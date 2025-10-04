<script setup lang="ts">
import * as label from '@destyler/label'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './style.css'

const [state, send] = useMachine(label.machine({ id: useId() }))

const api = computed(() => label.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="flex flex-wrap items-center gap-[15px] px-5">
    <label v-bind="api.getRootProps()">
      First name
    </label>
    <input
      id="firstName"
      class="bg-input border inline-flex h-[35px] w-[200px]
      appearance-none items-center justify-center rounded-lg
      px-[10px] text-sm leading-none shadow-sm outline-none
      focus:shadow-[0_0_0_2px_black] text-foreground
      selection:color-primary selection:bg-background"
      type="text"
      value="Elone Hoo"
    >
  </div>
</template>
