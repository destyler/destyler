<script setup lang="ts">
import * as radio from "@destyler/radio"
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed } from "vue"

const items = [
  { id: "apple", label: "Apples" },
  { id: "orange", label: "Oranges" },
  { id: "mango", label: "Mangoes" },
  { id: "grape", label: "Grapes" },
]

const [state, send] = useMachine(radio.machine({ id: "1" }))

const api = computed(() => radio.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()">
    <h3 v-bind="api.getLabelProps()">Fruits</h3>
    <div
      v-for="opt in items"
      :key="opt.id"
    >
      <label v-bind="api.getItemProps({ value: opt.id })">
        <span v-bind="api.getItemTextProps({ value: opt.id })">{{ opt.label }}</span>
        <input v-bind="api.getItemHiddenInputProps({ value: opt.id })" />
        <div v-bind="api.getItemControlProps({ value: opt.id })" class="w-2 h-2 bg-gray data-[state=checked]:bg-green" />
      </label>
    </div>
  </div>
</template>
