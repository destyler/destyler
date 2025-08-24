<script setup lang="ts">
import * as combobox from '@destyler/combobox'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'

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
  <div v-bind="api.getRootProps()" class="combobox-root">
    <div v-bind="api.getControlProps()" class="combobox-control">
      <input
        v-bind="api.getInputProps()"
        class="combobox-input"
      >
      <button
        v-bind="api.getTriggerProps()"
        class="combobox-trigger"
      >
        <div class="combobox-chevron" :data-state="api.open ? 'open' : 'closed'">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </button>
    </div>
    <Teleport v-if="api.open" to="body">
      <div
        v-bind="api.getPositionerProps()"
        class="combobox-positioner"
      >
        <ul
          v-if="options.length > 0"
          v-bind="api.getContentProps()"
          class="combobox-content"
          :data-state="api.open ? 'open' : 'closed'"
        >
          <li
            v-for="item in options"
            :key="item.code"
            v-bind="api.getItemProps({ item })"
            class="combobox-item"
            :data-highlighted="api.highlightedValue === item.code"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>
