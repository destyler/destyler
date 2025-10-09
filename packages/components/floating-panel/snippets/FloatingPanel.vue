<script setup lang="ts">
import * as floatingPanel from '@destyler/floating-panel'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(floatingPanel.machine({
  id: useId(),
  closeOnEscape: true,
}))

const api = computed(() => floatingPanel.connect(state.value, send, normalizeProps))
</script>

<template>
  <main class="floating-panel mt-0!">
    <div class="flex items-center justify-center">
      <button
        v-bind="api.getTriggerProps()"
        class="btn"
      >
        Click
      </button>
      <div v-bind="api.getPositionerProps()">
        <div
          v-bind="api.getContentProps()"
          class="fixed rounded-lg border border-border bg-card text-card-foreground shadow-lg min-w-[320px] min-h-[150px]"
        >
          <div v-bind="api.getDragTriggerProps()" class="cursor-move">
            <div
              v-bind="api.getHeaderProps()"
              class="flex h-10 items-center justify-between border-b border-border px-4 py-2"
            >
              <p v-bind="api.getTitleProps()" class="text-sm font-medium mt-0!">
                title
              </p>
              <div data-scope="floating-panel" data-part="trigger-group" class="flex items-center gap-1 mt-0!">
                <button
                  v-bind="api.getCloseTriggerProps()"
                  class="inline-flex mt-0! items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                >
                  <div class="w-4 h-4 i-carbon:close-large" />
                </button>
              </div>
            </div>
          </div>
          <div v-bind="api.getBodyProps()" class="p-6 mt-0!">
            <p class="text-sm text-muted-foreground mt-0!">
              floating panel content
            </p>
          </div>

          <div v-bind="api.getResizeTriggerProps({ axis: 'n' })" class="absolute top-0 left-0 right-0 h-1 cursor-ns-resize bg-transparent mt-0!" />
          <div v-bind="api.getResizeTriggerProps({ axis: 'e' })" class="absolute top-0 right-0 bottom-0 w-1 cursor-ew-resize bg-transparent" />
          <div v-bind="api.getResizeTriggerProps({ axis: 'w' })" class="absolute top-0 left-0 bottom-0 w-1 cursor-ew-resize bg-transparent" />
          <div v-bind="api.getResizeTriggerProps({ axis: 's' })" class="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize bg-transparent" />
          <div v-bind="api.getResizeTriggerProps({ axis: 'ne' })" class="absolute top-0 right-0 w-2 h-2 cursor-ne-resize bg-transparent" />
          <div v-bind="api.getResizeTriggerProps({ axis: 'se' })" class="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize bg-transparent" />
          <div v-bind="api.getResizeTriggerProps({ axis: 'sw' })" class="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize bg-transparent" />
          <div v-bind="api.getResizeTriggerProps({ axis: 'nw' })" class="absolute top-0 left-0 w-2 h-2 cursor-nw-resize bg-transparent" />
        </div>
      </div>
    </div>
  </main>
</template>
