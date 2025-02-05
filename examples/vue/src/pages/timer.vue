<script setup lang="ts">
import * as timer from "@destyler/timer"
  import { normalizeProps, useMachine } from "@destyler/vue"
  import { computed } from "vue"

  const [state, send] = useMachine(
    timer.machine({
      id: "v1",
      countdown: true,
      autoStart: true,
      startMs: timer.parse({ days: 20, seconds: 1 }),
    }),
  )

  const api = computed(() => timer.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div v-bind="api.getAreaProps()" class="flex">
      <div v-bind="api.getItemProps({ type: 'days' })">
        {{ api.formattedTime.days }}
      </div>
      <div v-bind="api.getSeparatorProps()">:</div>
      <div v-bind="api.getItemProps({ type: 'hours' })">
        {{ api.formattedTime.hours }}
      </div>
      <div v-bind="api.getSeparatorProps()">:</div>
      <div v-bind="api.getItemProps({ type: 'minutes' })">
        {{ api.formattedTime.minutes }}
      </div>
      <div v-bind="api.getSeparatorProps()">:</div>
      <div v-bind="api.getItemProps({ type: 'seconds' })">
        {{ api.formattedTime.seconds }}
      </div>
    </div>

    <div v-bind="api.getControlProps()" class="flex gap-2">
      <button v-bind="api.getActionTriggerProps({ action: 'start' })">
        START
      </button>
      <button v-bind="api.getActionTriggerProps({ action: 'pause' })">
        PAUSE
      </button>
      <button v-bind="api.getActionTriggerProps({ action: 'resume' })">
        RESUME
      </button>
      <button v-bind="api.getActionTriggerProps({ action: 'reset' })">
        RESET
      </button>
    </div>
  </div>
</template>
