<script setup lang="ts">
import * as menu from "@destyler/menu";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed, useId,ref } from "vue";

const [state, send] = useMachine(menu.machine({ id: useId(), "aria-label": "File" }));
const api = computed(() => menu.connect(state.value, send, normalizeProps));

const items = ref([
  { value: "edit", label: "Edit" },
  { value: "duplicate", label: "Duplicate" },
  { value: "delete", label: "Delete" },
  { value: "export", label: "Export..." },
])
</script>

<template>
  <div ref="ref">
    <button v-bind="api.getTriggerProps()">
        Actions <span v-bind="api.getIndicatorProps()">▾</span>
    </button>
    <div v-bind="api.getPositionerProps()">
      <ul v-bind="api.getContentProps()">
        <li v-for="item in items" :key="item.value" v-bind="api.getItemProps({ value: item.value })">
          {{item.label}}
        </li>
      </ul>
    </div>
  </div>
</template>
