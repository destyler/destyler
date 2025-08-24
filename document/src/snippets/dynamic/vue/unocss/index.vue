<script setup lang="ts">
import * as dynamic from '@destyler/dynamic'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(
  dynamic.machine({
    id: useId(),
    value: ['React', 'Vue'],
  }),
)
const api = computed(() =>
  dynamic.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()" class="w-md p-6">
    <div class="flex flex-wrap gap-2 mb-4">
      <span
        v-for="(value, index) in api.value"
        :key="index"
        v-bind="api.getItemProps({ index, value })"
        class="relative group"
      >
        <div
          v-bind="api.getItemPreviewProps({ index, value })"
          class="bg-secondary text-secondary-foreground rounded-md px-3 py-1.5
          flex items-center gap-2 shadow-sm border border-px border-input"
        >
          <span class="text-sm font-medium">{{ value }}</span>
          <button
            v-bind="api.getItemDeleteTriggerProps({ index, value })"
            class="i-carbon:close inline-flex items-center justify-center h-5 w-5
            rounded-full bg-primary/50 hover:bg-primary
            transition-colors text-xs"
          />
        </div>
        <input
          v-bind="api.getItemInputProps({ index, value })"
          class="hidden absolute left-0 top-0 w-full px-2 py-1.5
          border border-input rounded-md focus:ring-2
          focus:ring-ring focus:border-transparent outline-none
          bg-background text-foreground"
        >
      </span>
    </div>
    <div class="relative">
      <input
        placeholder="Add Tag..."
        v-bind="api.getInputProps()"
        class="w-full px-4 py-2.5 border border-input rounded-md
        focus:ring-2 focus:ring-ring focus:border-primary
        outline-none bg-background text-foreground
        placeholder-muted-foreground"
      >
    </div>
  </div>
</template>
