<script setup lang="ts">
import { tabsControls, tabsData } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as tabs from '../../index'
import '../style.css'

const controls = useControls(tabsControls)

const [state, send] = useMachine(tabs.machine({ id: useId(), value: 'nils' }), {
  context: controls.context,
})

const api = computed(() => tabs.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <div v-bind="api.getRootProps()">
        <div v-bind="api.getIndicatorProps()" />
        <div v-bind="api.getListProps()">
          <button
            v-for="data in tabsData"
            v-bind="api.getTriggerProps({ value: data.id })"
            :key="data.id"
            :data-testid="`${data.id}-tab`"
          >
            {{ data.label }}
          </button>
        </div>

        <div
          v-for="data in tabsData"
          v-bind="api.getContentProps({ value: data.id })"
          :key="data.id"
          :data-testid="`${data.id}-tab-panel`"
        >
          <p>{{ data.content }}</p>
          <input v-if="data.id === 'agnes'" placeholder="Agnes">
        </div>
      </div>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
