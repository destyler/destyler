<script setup lang="ts">
import * as menu from "@destyler/menu";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed, useId,ref } from "vue";
import { menuControls } from '@destyler/shared'
import { useControls } from '../composables/useControls'

const controls = useControls(menuControls)

const [state, send] = useMachine(menu.machine({ id: useId(), "aria-label": "File" }),{
  context: controls.context,
});
const api = computed(() => menu.connect(state.value, send, normalizeProps));

const items = ref([
  { value: "edit", label: "Edit" },
  { value: "duplicate", label: "Duplicate" },
  { value: "delete", label: "Delete" },
  { value: "export", label: "Export..." },
])
</script>

<template>
  <div ref="ref" class="p-4">
    <button
      v-bind="api.getTriggerProps()"
      class="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
    >
      Actions
      <span
        v-bind="api.getIndicatorProps()"
        class="ml-2"
      >▾</span>
    </button>
    <div
      v-bind="api.getPositionerProps()"
      class="relative"
    >
      <ul
        v-bind="api.getContentProps()"
        class="absolute mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-gray-200 py-1"
      >
        <li
          v-for="item in items"
          :key="item.value"
          v-bind="api.getItemProps({ value: item.value })"
          class="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
        >
          {{item.label}}
        </li>
      </ul>
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
