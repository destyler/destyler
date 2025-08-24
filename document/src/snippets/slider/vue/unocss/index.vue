<script setup lang="ts">
import * as slider from '@destyler/slider'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(slider.machine({ id: useId(), value: [60] }))
const api = computed(() => slider.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()" class="flex touch-none select-none items-center">
    <div v-bind="api.getControlProps()" class="w-full relative">
      <div
        v-bind="api.getTrackProps()"
        class="relative h-2 w-full grow overflow-hidden
        rounded-full bg-secondary"
      >
        <div
          v-bind="api.getRangeProps()"
          class="absolute h-full bg-primary"
        />
      </div>
      <div
        v-for="(_, index) in api.value"
        :key="index"
        v-bind="api.getThumbProps({ index })"
        class="absolute top--1.5 cursor-pointer block h-5 w-5
        rounded-full border-2 border-primary bg-background
        ring-offset-background transition-colors focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-ring
        focus-visible:ring-offset-2 disabled:pointer-events-none
        disabled:opacity-50"
      >
        <input v-bind="api.getHiddenInputProps({ index })">
      </div>
    </div>
  </div>
</template>
