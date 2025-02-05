<script setup lang="ts">
import * as collapse from "@destyler/collapse"
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed,useId } from "vue"

const data = [
  { title: "Watercraft", content: "Sample accordion content" },
  { title: "Automobiles", content: "Sample accordion content" },
  { title: "Aircraft", content: "Sample accordion content" },
]

const [state, send] = useMachine(collapse.machine({ id: useId() }))

const api = computed(() =>
  collapse.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div ref="ref" v-bind="api.getRootProps()">
    <div
      v-for="item in data"
      :key="item.title"
      v-bind="api.getItemProps({ value: item.title })"
    >
      <h3>
        <button v-bind="api.getItemTriggerProps({ value: item.title })">
          {{ item.title }}
        </button>
      </h3>
      <div v-bind="api.getItemContentProps({ value: item.title })">
        {{ item.content }}
      </div>
    </div>
  </div>
</template>
