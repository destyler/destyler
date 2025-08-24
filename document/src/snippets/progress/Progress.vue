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
  <div v-bind="api.getRootProps()" class="w-full">
    <div
      v-bind="api.getTrackProps()"
      class="h-2 w-full overflow-hidden rounded-full bg-secondary"
    >
      <div
        v-bind="api.getRangeProps()"
        class="h-full w-full flex-1 bg-primary transition-all duration-300 ease-out"
      />
    </div>
  </div>
</template>
