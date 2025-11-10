<script setup lang="ts">
import { menuControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as menu from '../../index'
import '../style.css'

const controls = useControls(menuControls)

const [state, send] = useMachine(menu.machine({
  id: useId(),
  // eslint-disable-next-line no-console
  onSelect: console.log,
}), {
  context: controls.context,
})

const api = computed(() => menu.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <button v-bind="api.getTriggerProps()">
        Actions <span v-bind="api.getIndicatorProps()">▾</span>
      </button>
      <Teleport to="body">
        <div v-bind="api.getPositionerProps()">
          <ul v-bind="api.getContentProps()">
            <li v-bind="api.getItemProps({ value: 'edit' })">
              Edit
            </li>
            <li v-bind="api.getItemProps({ value: 'duplicate' })">
              Duplicate
            </li>
            <li v-bind="api.getItemProps({ value: 'delete' })">
              Delete
            </li>
            <li v-bind="api.getItemProps({ value: 'export' })">
              Export...
            </li>
          </ul>
        </div>
      </Teleport>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
