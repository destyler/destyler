<script setup lang="ts">
import * as combobox from '@destyler/combobox'
import { comboboxControls, listData } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'

import '@destyler/shared-private/styles/combobox.css'

const controls = useControls(comboboxControls)

const comboboxData = listData

const options = ref(comboboxData)
const collectionRef = computed(() =>
  combobox.collection({
    items: options.value,
    itemToValue: item => item.code,
    itemToString: item => item.label,
  }),
)
const [state, send] = useMachine(
  combobox.machine({
    id: useId(),
    collection: collectionRef.value,
    onOpenChange() {
      options.value = comboboxData
    },
    onInputValueChange({ inputValue }) {
      const filtered = comboboxData.filter(item =>
        item.label.toLowerCase().includes(inputValue.toLowerCase()),
      )
      options.value = filtered.length > 0 ? filtered : comboboxData
    },
  }),
  {
    context: computed(() => ({
      ...controls.context.value,
      collection: collectionRef.value,
    })),
  },
)
const api = computed(() =>
  combobox.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()" class="combobox-root">
    <label v-bind="api.getLabelProps()" class="combobox-label">
      Select country
    </label>

    <div v-bind="api.getControlProps()" class="combobox-control">
      <input
        v-bind="api.getInputProps()"
        class="combobox-input"
      >
      <button
        v-bind="api.getTriggerProps()"
        class="group combobox-trigger"
      >
        <div class="combobox-trigger-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z" /></svg>
        </div>
      </button>
      <button
        v-bind="api.getClearTriggerProps()"
        class="combobox-clear-trigger"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" /></svg>
      </button>
    </div>
  </div>
  <div
    v-bind="api.getPositionerProps()"
    class="combobox-positioner"
  >
    <ul
      v-if="options.length > 0"
      v-bind="api.getContentProps()"
      class="combobox-content"
    >
      <li
        v-for="item in options"
        :key="item.code"
        v-bind="api.getItemProps({ item })"
        class="combobox-item"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
