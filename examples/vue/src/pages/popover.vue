<script setup lang="ts">
  import * as popover from "@destyler/popover"
  import { normalizeProps, useMachine } from "@destyler/vue"
  import { computed,useId } from "vue"

  const [state, send] = useMachine(popover.machine({ id: useId() }))
  const api = computed(() => popover.connect(state.value, send, normalizeProps))
</script>

<template>
  <div ref="ref">
    <button v-bind="api.getTriggerProps()">Click me</button>
    <div v-bind="api.getPositionerProps()">
      <div v-bind="api.getContentProps()">
        <div v-bind="api.getTitleProps()">Presenters</div>
        <div v-bind="api.getDescriptionProps()">Description</div>
        <button>Action Button</button>
        <button v-bind="api.getCloseTriggerProps()">X</button>
      </div>
    </div>
  </div>
</template>
