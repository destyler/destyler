<script setup lang="ts">
import * as select from '@destyler/select'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './index.css'

const selectData = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Grapes', value: 'grapes' },
  { label: 'Pineapple', value: 'pineapple' },
]

const [state, send] = useMachine(
  select.machine({
    id: useId(),
    collection: select.collection({
      items: selectData,
    }),
  }),
)

const api = computed(() => select.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="select-container">
    <button
      v-bind="api.getTriggerProps()"
      class="select-trigger"
    >
      <span class="select-value">{{ api.valueAsString || "Select option" }}</span>
      <span class="select-icon" />
    </button>
  </div>

  <Teleport v-if="api.open" to="body">
    <div
      v-bind="api.getPositionerProps()"
      class="select-dropdown-positioner"
    >
      <ul
        v-bind="api.getContentProps()"
        class="select-dropdown"
      >
        <li
          v-for="item in selectData"
          :key="item.value"
          v-bind="api.getItemProps({ item })"
          class="select-option"
        >
          <span>{{ item.label }}</span>
          <span
            v-bind="api.getItemIndicatorProps({ item })"
            class="select-indicator"
          >
            <span class="select-check" />
          </span>
        </li>
      </ul>
    </div>
  </Teleport>
</template>
