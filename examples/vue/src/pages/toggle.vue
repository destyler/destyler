<script setup lang="ts">
import * as toggle from "@destyler/toggle"
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed } from "vue";

const [state, send] = useMachine(toggle.machine({ id: '1' }))
const api = computed(() => toggle.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()">
    <button v-bind="api.getItemProps({ value: 'bold' })">B</button>
    <button v-bind="api.getItemProps({ value: 'italic' })">I</button>
    <button v-bind="api.getItemProps({ value: 'underline' })">U</button>
  </div>
</template>
