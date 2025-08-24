<script setup lang="ts">
import * as tooltip from "@destyler/tooltip";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed, useId } from "vue";

const [state, send] = useMachine(tooltip.machine({ 
  id: useId(),
  openDelay: 300,
  closeDelay: 100,
}));
const api = computed(() => tooltip.connect(state.value, send, normalizeProps));
</script>

<template>
  <div class="tooltip-container">
    <button
      ref="ref"
      v-bind="api.getTriggerProps()"
      class="tooltip-trigger"
    >
      Hover me
    </button>
    <div v-bind="api.getPositionerProps()" class="tooltip-positioner">
      <div
        v-bind="api.getContentProps()"
        class="tooltip-content"
      >
        This is a tooltip following the mouse cursor.
      </div>
    </div>
  </div>
</template>
