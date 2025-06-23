<script setup lang="ts">
import * as combobox from '@destyler/combobox'
import { comboboxControls } from '@destyler/shared-private'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'

import { useControls } from '../composables/useControls'

const controls = useControls(comboboxControls)

const comboboxData = [
  { label: 'Zambia', code: 'ZA' },
  { label: 'Benin', code: 'BN' },
  { label: 'Canada', code: 'CA' },
  { label: 'Japan', code: 'JA' },
  { label: 'Nigeria', code: 'NG' },
]
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
  <div v-bind="api.getRootProps()" class="w-full max-w-xs mt-8 px-4">
    <label v-bind="api.getLabelProps()" class="block text-sm font-medium text-gray-700 mb-2">
      Select country
    </label>

    <div v-bind="api.getControlProps()" class="relative mt-1">
      <input
        v-bind="api.getInputProps()"
        class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-dark focus:outline-none focus:ring-1 focus:ring-dark"
      >
      <button
        v-bind="api.getTriggerProps()"
        class="group absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
      >
        <div class="text-gray-400 i-carbon:chevron-down group-data-[state=open]:rotate--180 transition-transform duration-300" />
      </button>
    </div>
  </div>
  <div
    v-bind="api.getPositionerProps()"
    class="w-full max-w-md mt-1 bg-white "
  >
    <ul
      v-if="options.length > 0"
      v-bind="api.getContentProps()"
      class="max-h-60 overflow-auto py-1 px-2 rounded-md shadow-lg border border-gray-200"
    >
      <li
        v-for="item in options"
        :key="item.code"
        v-bind="api.getItemProps({ item })"
        class="px-3 py-2 rounded-md data-[highlighted]:bg-dark-100 cursor-pointer text-gray-900 data-[highlighted]:text-light-100"
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
