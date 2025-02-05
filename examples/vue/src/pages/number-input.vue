<script setup lang="ts">
import * as numberInput from "@destyler/number-input";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed, useId } from "vue";

const [state, send] = useMachine(numberInput.machine({ id: useId() }));
const api = computed(() =>
  numberInput.connect(state.value, send, normalizeProps)
);
</script>

<template>
  <div ref="ref" v-bind="api.getRootProps()">
    <label v-bind="api.getLabelProps()">Enter number</label>
    <div>
      <button v-bind="api.getDecrementTriggerProps()">DEC</button>
      <input v-bind="api.getInputProps()" />
      <button v-bind="api.getIncrementTriggerProps()">INC</button>
    </div>
  </div>
</template>
