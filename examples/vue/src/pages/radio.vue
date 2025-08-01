<script setup lang="ts">
import * as radio from '@destyler/radio'
import { radioControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/radio.css'

const controls = useControls(radioControls)

const items = [
  { id: 'apple', label: 'Apples' },
  { id: 'orange', label: 'Oranges' },
  { id: 'mango', label: 'Mangoes' },
  { id: 'grape', label: 'Grapes' },
]

const [state, send] = useMachine(radio.machine({ id: useId() }), {
  context: controls.context,
})

const api = computed(() => radio.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()" class="radio-root">
    <h3 v-bind="api.getLabelProps()" class="radio-label">
      Fruits
    </h3>
    <div
      v-for="opt in items"
      :key="opt.id"
      class="radio-item"
    >
      <label
        v-bind="api.getItemProps({ value: opt.id })"
        class="radio-item-label"
      >
        <input v-bind="api.getItemHiddenInputProps({ value: opt.id })">
        <div
          v-bind="api.getItemControlProps({ value: opt.id })"
          class="radio-item-control"
        />
        <span
          v-bind="api.getItemTextProps({ value: opt.id })"
          class="radio-item-text"
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
