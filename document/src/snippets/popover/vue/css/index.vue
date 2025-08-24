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
  <div class="popover-container">
    <button
      v-bind="api.getTriggerProps()"
      class="popover-trigger"
    >
      Open popover
    </button>
    <Teleport v-if="api.open" to="body">
      <div v-bind="api.getPositionerProps()" class="popover-positioner">
        <div
          v-bind="api.getContentProps()"
          class="popover-content"
        >
          <div
            v-bind="api.getTitleProps()"
            class="popover-title"
          >
            Presenters
          </div>

          <div
            v-bind="api.getDescriptionProps()"
            class="popover-description"
          >
            Description
          </div>

          <button
            ref="buttonRef"
            class="popover-action-button"
          >
            Action Button
          </button>

          <button
            v-bind="api.getCloseTriggerProps()"
            class="popover-close-button i-carbon:close-large"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>
