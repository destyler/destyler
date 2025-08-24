<script setup lang="ts">
import * as checkbox from '@destyler/checkbox'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(checkbox.machine({ id: useId() }))

const api = computed(() =>
  checkbox.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <label v-bind="api.getRootProps()" class="flex items-center gap-2 cursor-pointer">
    <div
      v-bind="api.getControlProps()"
      class="peer h-4 w-4 shrink-0 rounded-sm border border-primary
      shadow-sm focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-ring focus-visible:ring-offset-2
      disabled:cursor-not-allowed disabled:opacity-50
      data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground
      flex items-center justify-center"
    >
      <div v-if="api.checked" class="i-carbon-checkmark w-3 h-3" />
    </div>
    <span
      v-bind="api.getLabelProps()"
      class="text-sm font-medium text-foreground leading-none
      peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      Input is
      <span v-if="api.checked"> checked</span>
      <span v-else> unchecked</span>
    </span>

    <input v-bind="api.getHiddenInputProps()">
  </label>
</template>
