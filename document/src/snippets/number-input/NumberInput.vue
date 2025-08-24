<script setup lang="ts">
import * as numberInput from '@destyler/number-input'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(numberInput.machine({
  id: useId(),
  value: '66',
  allowMouseWheel: true,
}))
const api = computed(() =>
  numberInput.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div
    class="w-full mt-0!"
    v-bind="api.getRootProps()"
  >
    <div class="flex items-center gap-2">
      <button
        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
        v-bind="api.getDecrementTriggerProps()"
      >
        <span class="text-lg text-primary">-</span>
      </button>
      <input
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-primary! ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center"
        v-bind="api.getInputProps()"
      >
      <button
        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
        v-bind="api.getIncrementTriggerProps()"
      >
        <span class="text-lg text-primary">+</span>
      </button>
    </div>
  </div>
</template>
