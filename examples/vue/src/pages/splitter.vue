<script setup lang="ts">
import * as splitter from "@destyler/splitter"
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed,useId } from "vue"

const [state, send] = useMachine(
  splitter.machine({
    id: useId(),
    size: [
      { id: "a", size: 50 },
      { id: "b", size: 50 },
    ]
  })
)

const api = computed(() => splitter.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div v-bind="api.getPanelProps({ id: 'a' })" class="bg-green p-2">
      <p>A</p>
    </div>
    <div v-bind="api.getResizeTriggerProps({ id: 'a:b' })" class="w-2" />
    <div v-bind="api.getPanelProps({ id: 'b' })" class="bg-red p-2">
      <p>B</p>
    </div>
  </div>
</template>
