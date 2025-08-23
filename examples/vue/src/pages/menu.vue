<script setup lang="ts">
import * as menu from '@destyler/menu'
import { menuControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'
import '@destyler/shared-private/styles/menu.css'

const controls = useControls(menuControls)

const [state, send] = useMachine(menu.machine({ 'id': useId(), 'aria-label': 'File' }), {
  context: controls.context,
})
const api = computed(() => menu.connect(state.value, send, normalizeProps))

const items = ref([
  { value: 'edit', label: 'Edit' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'delete', label: 'Delete' },
  { value: 'export', label: 'Export...' },
])
</script>

<template>
  <div class="menu-root">
    <button
      v-bind="api.getTriggerProps()"
      class="menu-trigger"
    >
      Actions
      <span
        v-bind="api.getIndicatorProps()"
        class="menu-indicator"
      >▾</span>
    </button>
    <div
      v-bind="api.getPositionerProps()"
      class="menu-positioner"
    >
      <ul
        v-bind="api.getContentProps()"
        class="menu-content"
      >
        <li
          v-for="item in items"
          :key="item.value"
          v-bind="api.getItemProps({ value: item.value })"
          class="menu-item"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
