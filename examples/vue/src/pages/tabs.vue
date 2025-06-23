<script setup lang="ts">
import * as tabs from "@destyler/tabs";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed,useId } from "vue";
import { tabsControls } from '@destyler/shared-private-private'
import { useControls } from '../composables/useControls'

const controls = useControls(tabsControls)

const data = [
  { value: "item-1", label: "Item one", content: "Item one content" },
  { value: "item-2", label: "Item two", content: "Item two content" },
  { value: "item-3", label: "Item three", content: "Item three content" },
];

const [state, send] = useMachine(tabs.machine({ id: useId(), value: "item-1" }),{
  context: controls.context,
});
const api = computed(() => tabs.connect(state.value, send, normalizeProps));
</script>

<template>
  <div ref="ref" v-bind="api.getRootProps()" class="max-w-md p-6 bg-white rounded-lg shadow-md">
    <div v-bind="api.getListProps()" class="flex gap-2 mb-6 border-b border-gray-200">
      <button
        v-for="item in data"
        v-bind="api.getTriggerProps({ value: item.value })"
        :key="item.value"
        class="px-4 py-2 hover:bg-gray-100 transition-colors
        duration-200 relative after:absolute after:bottom-[-1px]
        after:left-0 after:w-full after:h-[2px] after:bg-black
        after:opacity-0 data-[selected]:after:opacity-100 rounded-md
        data-[selected]:font-medium data-[selected]:bg-gray-100"
      >
        {{ item.label }}
      </button>
    </div>
    <div
      v-for="item in data"
      v-bind="api.getContentProps({ value: item.value })"
      :key="item.value"
      class="p-4 bg-gray-50 rounded-lg data-[hidden]:hidden"
    >
      <p class="text-gray-800">{{ item.content }}</p>
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
