<script setup lang="ts">
import * as select from '@destyler/select'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '../../styles/components/select.css'

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
  <div class="flex flex-col outline-none! mt-0!">
    <button v-bind="api.getTriggerProps()">
      <span>{{ api.valueAsString || "Select option" }}</span>
      <span />
    </button>
  </div>

  <Teleport v-if="api.open" to="body">
    <div data-layout="sinppets" v-bind="api.getPositionerProps()">
      <ul v-bind="api.getContentProps()">
        <li
          v-for="item in selectData"
          :key="item.value"
          v-bind="api.getItemProps({ item })"
        >
          <span>{{ item.label }}</span>
          <span v-bind="api.getItemIndicatorProps({ item })">
            <span />
          </span>
        </li>
      </ul>
    </div>
  </Teleport>
</template>
