<script setup lang="ts">
import * as floatingPanel from '@destyler/floating-panel'
import { floatingPanelControls } from '@destyler/shared-private'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useControls } from '../composables/useControls'

const controls = useControls(floatingPanelControls)

const [state, send] = useMachine(floatingPanel.machine({ id: useId() }), {
  context: controls.context,
})

const api = computed(() => floatingPanel.connect(state.value, send, normalizeProps))
</script>

<template>
  <main class="floating-panel p-8">
    <div class="flex items-center justify-center">
      <button v-bind="api.getTriggerProps()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
        Toggle Panel
      </button>
      <div v-bind="api.getPositionerProps()">
        <div v-bind="api.getContentProps()" class="bg-white rounded-lg shadow-lg border border-gray-200 min-w-[320px] min-h-150px">
          <div v-bind="api.getDragTriggerProps()" class="cursor-move">
            <div v-bind="api.getHeaderProps()" class="flex items-center justify-between p-4 border-b border-gray-200">
              <p v-bind="api.getTitleProps()" class="font-semibold text-gray-700">
                Floating Panel
              </p>
              <div data-scope="floating-panel" data-part="trigger-group" class="flex space-x-2">
                <button v-bind="api.getMinimizeTriggerProps()" class="p-1.5 hover:bg-gray-100 rounded-md text-gray-500">
                  <div class="w-4 h-4 i-carbon:minimize" />
                </button>
                <button v-bind="api.getMaximizeTriggerProps()" class="p-1.5 hover:bg-gray-100 rounded-md text-gray-500">
                  <div class="w-4 h-4 i-carbon:maximize" />
                </button>
                <button v-bind="api.getRestoreTriggerProps()" class="p-1.5 hover:bg-gray-100 rounded-md text-gray-500">
                  <div class="w-4 h-4 i-carbon:arrow-down-left" />
                </button>
                <button v-bind="api.getCloseTriggerProps()" class="p-1.5 hover:bg-gray-100 rounded-md text-gray-500">
                  <div class="w-4 h-4 i-carbon:close-large" />
                </button>
              </div>
            </div>
          </div>
          <div v-bind="api.getBodyProps()" class="p-4">
            <p class="text-gray-600">
              Some content
            </p>
          </div>

          <div v-bind="api.getResizeTriggerProps({ axis: 'n' })" class="absolute top-0 left-0 right-0 h-1 cursor-ns-resize" />
          <div v-bind="api.getResizeTriggerProps({ axis: 'e' })" class="absolute top-0 right-0 bottom-0 w-1 cursor-ew-resize" />
          <div v-bind="api.getResizeTriggerProps({ axis: 'w' })" class="absolute top-0 left-0 bottom-0 w-1 cursor-ew-resize" />
          <div v-bind="api.getResizeTriggerProps({ axis: 's' })" class="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize" />
          <div v-bind="api.getResizeTriggerProps({ axis: 'ne' })" class="absolute top-0 right-0 w-2 h-2 cursor-ne-resize" />
          <div v-bind="api.getResizeTriggerProps({ axis: 'se' })" class="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize" />
          <div v-bind="api.getResizeTriggerProps({ axis: 'sw' })" class="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize" />
          <div v-bind="api.getResizeTriggerProps({ axis: 'nw' })" class="absolute top-0 left-0 w-2 h-2 cursor-nw-resize" />
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
</template>
