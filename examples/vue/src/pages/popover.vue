<script setup lang="ts">
import * as popover from '@destyler/popover'
import { popoverControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/popover.css'

const controls = useControls(popoverControls)

const [state, send] = useMachine(popover.machine({ id: useId() }), {
  context: controls.context,
})
const api = computed(() => popover.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="popover-demo-root">
    <button
      v-bind="api.getTriggerProps()"
      class="popover-trigger"
    >
      Click me
    </button>
    <Teleport to="body" :disabled="!api.portalled">
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

          <a href="#" data-testid="focusable-link">
            Focusable Link
          </a>

          <div
            v-bind="api.getDescriptionProps()"
            class="popover-description"
          >
            Description
          </div>

          <button class="popover-action-btn">
            Action Button
          </button>

          <button
            v-bind="api.getCloseTriggerProps()"
            class="popover-close-btn"
          >
            x
          </button>
        </div>
      </div>
    </Teleport>
    <span data-testid="plain-text">I am just text</span>
    <button data-testid="button-after">
      Button :after
    </button>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
