<script setup lang="ts">
import * as combobox from "@destyler/combobox"
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed, ref } from "vue"
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
    itemToValue: (item) => item.code,
    itemToString: (item) => item.label,
  }),
)
const [state, send] = useMachine(
  combobox.machine({
    id: "1",
    collection: collectionRef.value,
    onOpenChange() {
      options.value = comboboxData
    },
    onInputValueChange({ inputValue }) {
      const filtered = comboboxData.filter((item) =>
        item.label.toLowerCase().includes(inputValue.toLowerCase()),
      )
      options.value = filtered.length > 0 ? filtered : comboboxData
    },
  }),
  {
    context: computed(() => ({
      collection: collectionRef.value,
    })),
  },
)
const api = computed(() =>
  combobox.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()">
    <label v-bind="api.getLabelProps()">Select country</label>

    <div v-bind="api.getControlProps()">
      <input v-bind="api.getInputProps()" />
      <button v-bind="api.getTriggerProps()">▼</button>
    </div>
  </div>
  <div v-bind="api.getPositionerProps()" class="bg-white text-dark">
    <ul v-if="options.length > 0" v-bind="api.getContentProps()">
      <li
        v-for="item in options"
        :key="item.code"
        v-bind="api.getItemProps({ item })"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>
