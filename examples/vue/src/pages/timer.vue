<script setup lang="ts">
import { StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import * as timer from '@destyler/timer'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed } from 'vue'

const [state, send] = useMachine(
  timer.machine({
    id: 'v1',
    countdown: true,
    autoStart: true,
    startMs: timer.parse({ days: 20, seconds: 1 }),
  }),
)

const api = computed(() => timer.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()" class="min-h-screen flex flex-col items-center justify-center p-8">
    <div v-bind="api.getAreaProps()" class="flex space-x-2 mb-8 p-6 bg-white rounded-xl shadow-lg">
      <div v-bind="api.getItemProps({ type: 'days' })" class="text-4xl font-mono font-bold text-gray-800 w-16 text-center">
        {{ api.formattedTime.days }}
      </div>
      <div v-bind="api.getSeparatorProps()" class="text-4xl font-mono text-gray-600">
        :
      </div>
      <div v-bind="api.getItemProps({ type: 'hours' })" class="text-4xl font-mono font-bold text-gray-800 w-16 text-center">
        {{ api.formattedTime.hours }}
      </div>
      <div v-bind="api.getSeparatorProps()" class="text-4xl font-mono text-gray-600">
        :
      </div>
      <div v-bind="api.getItemProps({ type: 'minutes' })" class="text-4xl font-mono font-bold text-gray-800 w-16 text-center">
        {{ api.formattedTime.minutes }}
      </div>
      <div v-bind="api.getSeparatorProps()" class="text-4xl font-mono text-gray-600">
        :
      </div>
      <div v-bind="api.getItemProps({ type: 'seconds' })" class="text-4xl font-mono font-bold text-gray-800 w-16 text-center">
        {{ api.formattedTime.seconds }}
      </div>
    </div>

    <div v-bind="api.getControlProps()" class="flex gap-4">
      <button
        v-bind="api.getActionTriggerProps({ action: 'start' })"
        class="px-6 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
      >
        START
      </button>
      <button
        v-bind="api.getActionTriggerProps({ action: 'pause' })"
        class="px-6 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
      >
        PAUSE
      </button>
      <button
        v-bind="api.getActionTriggerProps({ action: 'resume' })"
        class="px-6 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
      >
        RESUME
      </button>
      <button
        v-bind="api.getActionTriggerProps({ action: 'reset' })"
        class="px-6 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
      >
        RESET
      </button>
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
  </Toolbar>
</template>
