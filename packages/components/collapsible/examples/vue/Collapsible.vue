<script setup lang="ts">
import { collapsibleControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as collapsible from '../../index'
import '../style.css'

const controls = useControls(collapsibleControls)

const [state, send] = useMachine(collapsible.machine({ id: useId() }), {
  context: controls.context,
})
const api = computed(() =>
  collapsible.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <Layout>
    <main>
      <div v-bind="api.getRootProps()">
        <button v-bind="api.getTriggerProps()">
          Collapsible Trigger
        </button>
        <div v-bind="api.getContentProps()">
          <p>
            Lorem dfd dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna sfsd. Ut enim ad minimdfd v eniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
            id est laborum. <a href="#">Some Link</a>
          </p>
        </div>
      </div>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" :state="controls.context" />
      </template>
    </Toolbar>
  </Layout>
</template>
