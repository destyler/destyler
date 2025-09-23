<script setup lang="ts">
import * as popover from '@destyler/popover'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'
import '../../styles/components/popover.css'

const buttonRef = ref(null)

const [state, send] = useMachine(popover.machine({
  id: useId(),
  initialFocusEl: () => buttonRef.value,
}))
const api = computed(() => popover.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="mt-0!">
    <button v-bind="api.getTriggerProps()">
      Open popover
    </button>
    <Teleport v-if="api.open" to="body">
      <div v-bind="api.getPositionerProps()" data-layout="sinppets">
        <div v-bind="api.getContentProps()">
          <div v-bind="api.getTitleProps()">
            Presenters
          </div>

          <div v-bind="api.getDescriptionProps()">
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

          <button v-bind="api.getCloseTriggerProps()" />
        </div>
      </div>
    </Teleport>
  </div>
</template>
