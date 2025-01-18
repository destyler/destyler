<script setup lang="ts">
import * as tooltip from "@destyler/tooltip";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed,useId } from "vue";

const [state, send] = useMachine(tooltip.machine({ id: useId() }));
const api = computed(() => tooltip.connect(state.value, send, normalizeProps));
</script>

<template>
  <div>
    <button ref="ref" v-bind="api.getTriggerProps()">Hover me</button>
    <div v-bind="api.getPositionerProps()">
      <div v-bind="api.getContentProps()">Tooltip</div>
    </div>
  </div>
</template>
