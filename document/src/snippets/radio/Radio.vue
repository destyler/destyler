<script setup lang="ts">
import * as radio from '@destyler/radio'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const items = [
  { id: 'default', label: 'Default' },
  { id: 'comfortable', label: 'Comfortable' },
  { id: 'compact', label: 'Compact' },
]

const [state, send] = useMachine(radio.machine({
  id: useId(),
  value: 'default',
}))

const api = computed(() => radio.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()" class="grid gap-2">
    <div
      v-for="opt in items"
      :key="opt.id"
      class="flex items-center space-x-3 mt-0!"
    >
      <label
        v-bind="api.getItemProps({ value: opt.id })"
        class="flex items-center space-x-2 cursor-pointer"
      >
        <div class="relative">
          <input
            v-bind="api.getItemHiddenInputProps({ value: opt.id })"
            class="peer sr-only"
          >
          <div
            v-bind="api.getItemControlProps({ value: opt.id })"
            class="h-4 w-4 rounded-full border border-primary shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
          />
        </div>
        <span
          v-bind="api.getItemTextProps({ value: opt.id })"
          class="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {{ opt.label }}
        </span>
      </label>
    </div>
  </div>
</template>
