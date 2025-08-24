<script setup lang="ts">
import * as splitter from "@destyler/splitter"
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed,useId } from "vue"

const [state, send] = useMachine(
  splitter.machine({
    id: useId(),
    size: [
      { id: "a", size: 30,minSize:15 },
      { id: "b", size: 70 ,minSize: 0 },
    ]
  })
)

const api = computed(() => splitter.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()" class="splitter-root">
    <div v-bind="api.getPanelProps({ id: 'a' })" class="splitter-panel-a">
      <div class="splitter-panel-content">
        <p class="splitter-panel-text">One</p>
      </div>
    </div>
    <div
      v-bind="api.getResizeTriggerProps({ id: 'a:b' })"
      class="splitter-resize-trigger"
    >
      <div class="splitter-resize-handle" />
      <div class="splitter-resize-area" />
    </div>
    <div v-bind="api.getPanelProps({ id: 'b' })" class="splitter-panel-b">
      <div class="splitter-panel-content">
        <p class="splitter-panel-text">Two</p>
      </div>
    </div>
  </div>
</template>

<style>
.cursor-col-resize {
  cursor: col-resize;
}
</style>
