<script setup lang="ts">
import * as popover from '@destyler/popover'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId, ref } from 'vue'

const buttonRef = ref(null)

const [state, send] = useMachine(popover.machine({ 
  id: useId(),
  initialFocusEl: ()=> buttonRef.value,
}))
const api = computed(() => popover.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="mt-0!">
    <button
      v-bind="api.getTriggerProps()"
      class="btn"
    >
      Open popover
    </button>
    <Teleport v-if="api.open" to="body">
      <div v-bind="api.getPositionerProps()" class="z-50">
        <div
          v-bind="api.getContentProps()"
          class="z-50 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none"
        >
          <div
            v-bind="api.getTitleProps()"
            class="text-sm font-medium mb-2"
          >
            Presenters
          </div>

          <div
            v-bind="api.getDescriptionProps()"
            class="text-sm text-muted-foreground mb-4"
          >
            Description
          </div>

          <button
            ref="buttonRef"
            class="inline-flex w-full items-center justify-center rounded-md text-sm 
            font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 
            focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 
            bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2"
          >
            Action Button
          </button>

          <button
            v-bind="api.getCloseTriggerProps()"
            class="absolute top-3.5 right-3.5 bg-muted-foreground/70!
            hover:bg-muted-foreground i-carbon:close-large rounded-sm
            opacity-70 transition-opacity
            hover:opacity-100 "
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>
