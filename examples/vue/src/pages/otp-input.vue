<script setup lang="ts">
import * as otpInput from "@destyler/otp-input";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed } from "vue";

const [state, send] = useMachine(otpInput.machine({ id: "1" }));
const api = computed(() => otpInput.connect(state.value, send, normalizeProps));
</script>

<template>
  <div>
    <div ref="ref" v-bind="api.getRootProps()">
      <input v-bind="api.getInputProps({ index: 0 })" />
      <input v-bind="api.getInputProps({ index: 1 })" />
      <input v-bind="api.getInputProps({ index: 2 })" />
    </div>
    <button @click="api.clearValue">Clear</button>
  </div>
</template>
