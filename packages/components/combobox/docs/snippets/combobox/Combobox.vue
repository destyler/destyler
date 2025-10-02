<script setup lang="ts">
import * as combobox from '@destyler/combobox'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'
import '@docs/styles/components/combobox.css'

const comboboxData = [
  { label: 'Vue', code: 'vue' },
  { label: 'React', code: 'react' },
  { label: 'Svelte', code: 'svelte' },
  { label: 'Solid', code: 'solid' },
  { label: 'Nuxt', code: 'nuxt' },
  { label: 'Next', code: 'next' },
  { label: 'Svelte Kit', code: 'svelte-kit' },
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
    placeholder: 'Select a framework',
  }),
)
const api = computed(() =>
  combobox.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div v-bind="api.getControlProps()">
      <input v-bind="api.getInputProps()">
      <button v-bind="api.getTriggerProps()">
        <div />
      </button>
    </div>
    <Teleport v-if="api.open" to="body">
      <div data-layout="sinppets" v-bind="api.getPositionerProps()">
        <ul
          v-if="options.length > 0"
          v-bind="api.getContentProps()"
        >
          <li
            v-for="item in options"
            :key="item.code"
            v-bind="api.getItemProps({ item })"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>
