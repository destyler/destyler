<script setup lang="ts">
import * as radio from "@destyler/radio"
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed,useId } from "vue"
import { radioControls } from '@destyler/shared'
import { useControls } from '../composables/useControls'

const controls = useControls(radioControls)

const items = [
  { id: "apple", label: "Apples" },
  { id: "orange", label: "Oranges" },
  { id: "mango", label: "Mangoes" },
  { id: "grape", label: "Grapes" },
]

const [state, send] = useMachine(radio.machine({ id: useId() }),{
  context: controls.context,
})

const api = computed(() => radio.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()" class="max-w-md p-6 border border-gray-200 rounded-lg shadow-sm">
    <h3 v-bind="api.getLabelProps()" class="text-xl font-semibold mb-4 text-gray-800">Fruits</h3>
    <div
      v-for="opt in items"
      :key="opt.id"
      class="mb-3"
    >
      <label
        v-bind="api.getItemProps({ value: opt.id })"
        class="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors"
      >
        <input v-bind="api.getItemHiddenInputProps({ value: opt.id })" />
        <div
          v-bind="api.getItemControlProps({ value: opt.id })"
          class="w-4 h-4 border-2 border-gray-300 rounded-full transition-colors data-[state=checked]:bg-black data-[state=checked]:border-black"
        />
        <span
          v-bind="api.getItemTextProps({ value: opt.id })"
          class="text-gray-700 group-hover:text-gray-900"
        >
          {{ opt.label }}
        </span>
      </label>
    </div>
  </div>

  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
