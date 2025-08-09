<script setup lang="ts">
import * as select from '@destyler/select'
import { listData, selectControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/select.css'

const controls = useControls(selectControls)

const selectData = listData.map(item => ({
  label: item.label,
  value: item.code,
}))

const [state, send] = useMachine(
  select.machine({
    id: useId(),
    collection: select.collection({
      items: selectData,
    }),
  }),
  {
    context: controls.context,
  },
)

const api = computed(() => select.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="select-root">
    <label
      v-bind="api.getLabelProps()"
      class="select-label"
    >
      Label
    </label>
    <button
      v-bind="api.getTriggerProps()"
      class="select-trigger"
    >
      <span>{{ api.valueAsString || "Select option" }}</span>
      <span class="select-trigger-icon i-carbon:chevron-right" />
    </button>
    <button v-bind="api.getClearTriggerProps()">
      X
    </button>
  </div>

  <div
    v-bind="api.getPositionerProps()"
    class="select-positioner"
  >
    <ul
      v-bind="api.getContentProps()"
      class="select-content"
    >
      <li
        v-for="item in selectData"
        :key="item.value"
        v-bind="api.getItemProps({ item })"
        :data-testid="`item-${item.label}`"
        class="select-item"
      >
        <span>{{ item.label }}</span>
        <span
          v-bind="api.getItemIndicatorProps({ item })"
          class="select-item-indicator"
        >
          ✓
        </span>
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
