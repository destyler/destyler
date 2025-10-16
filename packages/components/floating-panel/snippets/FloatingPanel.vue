<script setup lang="ts">
import * as floatingPanel from '@destyler/floating-panel'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './style.css'

function getCenterPosition(width = 320, height = 150) {
  if (typeof window === 'undefined') {
    return { x: 100, y: 100 }
  }
  const x = Math.max(0, Math.round((window.innerWidth - width) / 2))
  const y = Math.max(0, Math.round((window.innerHeight - height) / 2))
  return { x, y }
}

const [state, send] = useMachine(floatingPanel.machine({
  id: useId(),
  closeOnEscape: true,
  position: getCenterPosition(320, 150),
  resizable: true,
  draggable: true,
  onStageChange(details) {

  },
  onSizeChange(details){

  },
  onSizeChangeEnd(details) {
    
  },
}))

const api = computed(() => floatingPanel.connect(state.value, send, normalizeProps))
</script>

<template>
  <button v-bind="api.getTriggerProps()">
    Open Floating Panel
  </button>
  <Teleport to="body">
    <div data-layout="sinppets">
      <div v-bind="api.getPositionerProps()">
        <div v-bind="api.getContentProps()">
          <div v-bind="api.getDragTriggerProps()">
            <div v-bind="api.getHeaderProps()">
              <p v-bind="api.getTitleProps()">
                title
              </p>
              <div class="flex items-center gap-1 mt-0!">
                <button v-bind="api.getMinimizeTriggerProps()">
                  <div class="w-4 h-4 i-ph:minus-bold" />
                </button>
                <button v-bind="api.getMaximizeTriggerProps()">
                  <div class="w-4 h-4 i-ph:arrows-out-simple-bold" />
                </button>
                <button v-bind="api.getRestoreTriggerProps()">
                  <div class="w-4 h-4 i-ph:arrow-down-left-bold" />
                </button>
                <button v-bind="api.getCloseTriggerProps()">
                  <div class="w-4 h-4 i-ph:x-bold" />
                </button>
              </div>
            </div>
          </div>
          <div v-bind="api.getBodyProps()">
            <p class="text-sm text-muted-foreground mt-0!">
              floating panel content
            </p>
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
  </Teleport>
</template>
