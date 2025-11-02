<script setup lang="ts">
import { hoverCardControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as hoverCard from '../../index'
import '../style.css'

const controls = useControls(hoverCardControls)

const [state, send] = useMachine(hoverCard.machine({ id: useId() }), {
  context: controls.context,
})

const api = computed(() => hoverCard.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <div style="display: flex; gap: 50px">
        <a href="https://twitter.com/elonehoo" target="_blank" v-bind="api.getTriggerProps()"> Twitter </a>

        <Teleport v-if="api.open" to="body">
          <div v-bind="api.getPositionerProps()">
            <div v-bind="api.getContentProps()">
              <div v-bind="api.getArrowProps()">
                <div v-bind="api.getArrowTipProps()" />
              </div>
              Twitter Preview
              <a href="https://twitter.com/elonehoo" target="_blank"> Twitter </a>
            </div>
          </div>
        </Teleport>

        <div data-part="test-text">
          Test text
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
