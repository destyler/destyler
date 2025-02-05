<script setup lang="ts">
import * as dynamic from "@destyler/dynamic";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed } from "vue";

const [state, send] = useMachine(
  dynamic.machine({
    id: "1",
    value: ["React", "Vue"],
  })
);
const api = computed(() =>
  dynamic.connect(state.value, send, normalizeProps)
);
</script>

<template>
  <div ref="ref" v-bind="api.getRootProps()">
    <span v-for="(value, index) in api.value" :key="index" v-bind="api.getItemProps({ index, value })">
      <div v-bind="api.getItemPreviewProps({ index, value })">
        <span>{{ value }} </span>
        <button v-bind="api.getItemDeleteTriggerProps({ index, value })">
          &#x2715;
        </button>
      </div>
      <input v-bind="api.getItemInputProps({ index, value })" />
    </span>
    <input placeholder="Add tag..." v-bind="api.getInputProps()" />
  </div>
</template>
