<script setup lang="ts">
import * as edit from "@destyler/edit";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed, useId } from "vue";

const [state, send] = useMachine(edit.machine({
  id: useId(),
  value: "Hello, World!"
}));
const api = computed(() => edit.connect(state.value, send, normalizeProps));
</script>

<template>
  <div ref="ref" v-bind="api.getRootProps()">
    <div v-bind="api.getAreaProps()">
      <input v-bind="api.getInputProps()" />
      <span v-bind="api.getPreviewProps()" />
    </div>
  </div>
</template>
