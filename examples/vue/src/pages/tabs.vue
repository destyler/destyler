<script setup lang="ts">
import * as tabs from "@destyler/tabs";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed,useId } from "vue";

const data = [
  { value: "item-1", label: "Item one", content: "Item one content" },
  { value: "item-2", label: "Item two", content: "Item two content" },
  { value: "item-3", label: "Item three", content: "Item three content" },
];

const [state, send] = useMachine(tabs.machine({ id: useId(), value: "item-1" }));
const api = computed(() => tabs.connect(state.value, send, normalizeProps));
</script>

<template>
  <div ref="ref" v-bind="api.getRootProps()">
    <div v-bind="api.getListProps()">
      <button
        v-for="item in data"
        v-bind="api.getTriggerProps({ value: item.value })"
        :key="item.value"
      >
        {{ item.label }}
      </button>
    </div>
    <div
      v-for="item in data"
      v-bind="api.getContentProps({ value: item.value })"
      :key="item.value"
    >
      <p>{{ item.content }}</p>
    </div>
  </div>
</template>
