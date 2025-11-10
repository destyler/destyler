<script setup lang="ts">
import { floatingPanelControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as floatingPanel from '../../index'
import '../style.css'

const controls = useControls(floatingPanelControls)

const [state, send] = useMachine(floatingPanel.machine({ id: useId() }), {
  context: controls.context,
})

const api = computed(() => floatingPanel.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <div>
        <button v-bind="api.getTriggerProps()">
          Toggle Panel
        </button>
        <div v-bind="api.getPositionerProps()">
          <div v-bind="api.getContentProps()">
            <div v-bind="api.getDragTriggerProps()">
              <div v-bind="api.getHeaderProps()">
                <p v-bind="api.getTitleProps()">
                  Floating Panel
                </p>
                <div data-scope="floating-panel" data-part="trigger-group">
                  <button v-bind="api.getMinimizeTriggerProps()">
                    _
                  </button>
                  <button v-bind="api.getMaximizeTriggerProps()">
                    +
                  </button>
                  <button v-bind="api.getRestoreTriggerProps()">
                    &#9633;
                  </button>
                  <button v-bind="api.getCloseTriggerProps()">
                    x
                  </button>
                </div>
              </div>
            </div>
            <div v-bind="api.getBodyProps()">
              <p>Some content</p>
            </div>

            <div v-bind="api.getResizeTriggerProps({ axis: 'n' })" />
            <div v-bind="api.getResizeTriggerProps({ axis: 'e' })" />
            <div v-bind="api.getResizeTriggerProps({ axis: 'w' })" />
            <div v-bind="api.getResizeTriggerProps({ axis: 's' })" />
            <div v-bind="api.getResizeTriggerProps({ axis: 'ne' })" />
            <div v-bind="api.getResizeTriggerProps({ axis: 'se' })" />
            <div v-bind="api.getResizeTriggerProps({ axis: 'sw' })" />
            <div v-bind="api.getResizeTriggerProps({ axis: 'nw' })" />
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
