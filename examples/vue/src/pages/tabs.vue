<script setup lang="ts">
import { tabsControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import * as tabs from '@destyler/tabs'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/tabs.css'

const controls = useControls(tabsControls)

const data = [
  { value: 'item-1', label: 'Item one', content: 'Item one content' },
  { value: 'item-2', label: 'Item two', content: 'Item two content' },
  { value: 'item-3', label: 'Item three', content: 'Item three content' },
]

const [state, send] = useMachine(tabs.machine({ id: useId(), value: 'item-1' }), {
  context: controls.context,
})
const api = computed(() => tabs.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()" class="tabs-root">
    <div v-bind="api.getListProps()" class="tabs-list">
      <button
        v-for="item in data"
        v-bind="api.getTriggerProps({ value: item.value })"
        :key="item.value"
        class="tabs-trigger"
        :data-testid="`${item.value}-tab`"
      >
        {{ item.label }}
      </button>
    </div>
    <div
      v-for="item in data"
      v-bind="api.getContentProps({ value: item.value })"
      :key="item.value"
      class="tabs-content"
      :data-testid="`${item.value}-tab-panel`"
    >
      <p class="tabs-content-text">
        {{ item.content }}
      </p>
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
