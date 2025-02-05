<script setup lang="ts">
  import * as progress from "@destyler/progress"
  import { normalizeProps, useMachine } from "@destyler/vue"
  import { computed,useId } from "vue"

  const [state, send] = useMachine(progress.machine({ id: useId(),value: 30 }))

  const api = computed(() =>
    progress.connect(state.value, send, normalizeProps),
  )
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div v-bind="api.getLabelProps()">Upload progress</div>
    <div v-bind="api.getTrackProps()" class="bg-gray h-10">
      <div v-bind="api.getRangeProps()" class="bg-green h-10"/>
    </div>
  </div>
</template>
