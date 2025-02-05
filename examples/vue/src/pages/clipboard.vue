<script setup lang="ts">
  import * as clipboard from "@destyler/clipboard"
  import { useMachine, normalizeProps } from "@destyler/vue"
  import { computed, useId } from "vue"

  const [state, send] = useMachine(
    clipboard.machine({
      id: useId(),
      value: "https://github.com/destyler/destyler",
    }),
  )

  const api = computed(() =>
    clipboard.connect(state.value, send, normalizeProps),
  )
</script>

<template>
  <div v-bind="api.getRootProps()">
    <label v-bind="api.getLabelProps()">Copy this link</label>
    <div v-bind="api.getControlProps()">
      <input v-bind="api.getInputProps()" style="width: 100%" />
      <button v-bind="api.getTriggerProps()" class="w-10 h-10">
        <div v-if="api.copied" class="bg-red w-10 h-10" />
        <div v-else class="bg-green w-10 h-10" />
      </button>
    </div>
  </div>
</template>
