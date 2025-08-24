<script setup lang="ts">
import * as toggle from '@destyler/toggle'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(toggle.machine({
  id: useId(),
  multiple: true,
  value: ['bold'],
}))
const api = computed(() => toggle.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="flex items-center justify-center">
    <div
      v-bind="api.getRootProps()"
      class="inline-flex items-center justify-center gap-1 rounded-md p-1 shadow-sm "
    >
      <button
        v-for="(item, index) in ['bold', 'italic', 'underline']"
        :key="index"
        v-bind="api.getItemProps({ value: item })"
        class="inline-flex items-center justify-center h-9 w-9 rounded-md px-3 text-sm
        font-medium ring-offset-background transition-all focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary
        hover:bg-primary hover:text-accent data-[state=on]:text-accent text-foreground"
      >
        {{ item[0].toUpperCase() }}
      </button>
    </div>
  </div>
</template>
