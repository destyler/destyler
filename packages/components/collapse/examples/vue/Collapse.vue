<script setup lang="ts">
import { collapseControls, collapseData } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as collapse from '../../index'
import '../style.css'

const controls = useControls(collapseControls)

const [state, send] = useMachine(collapse.machine({
  id: useId(),
}), {
  context: controls.context,
})

const api = computed(() => collapse.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <div v-bind="api.getRootProps()">
        <div v-for="item in collapseData" :key="item.id" v-bind="api.getItemProps({ value: item.id })">
          <h3>
            <button :data-testid="`${item.id}:trigger`" v-bind="api.getItemTriggerProps({ value: item.id })">
              {{ item.title }}
              <div v-bind="api.getItemIndicatorProps({ value: item.id })">
                >
              </div>
            </button>
          </h3>
          <div :data-testid="`${item.id}:content`" v-bind="api.getItemContentProps({ value: item.id })">
            {{ item.content }}
          </div>
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
