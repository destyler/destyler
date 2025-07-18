<script setup lang="ts">
import * as dialog from '@destyler/dialog'
import { dialogControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/dialog.css'

const controls = useControls(dialogControls)

const [state, send] = useMachine(dialog.machine({
  id: useId(),
}), {
  context: controls.context,
})
const api = computed(() => dialog.connect(state.value, send, normalizeProps))
</script>

<template>
  <button
    v-bind="api.getTriggerProps()"
    class="dialog-trigger"
  >
    Open Dialog
  </button>
  <div>
    <div
      v-bind="api.getBackdropProps()"
      class="dialog-backdrop"
    />
    <div
      v-bind="api.getPositionerProps()"
      class="dialog-positioner"
    >
      <div
        v-bind="api.getContentProps()"
        class="dialog-content"
      >
        <h2
          v-bind="api.getTitleProps()"
          class="dialog-title"
        >
          Edit profile
        </h2>
        <p
          v-bind="api.getDescriptionProps()"
          class="dialog-description"
        >
          Make changes to your profile here. Click save when you are done.
        </p>
        <button
          v-bind="api.getCloseTriggerProps()"
          class="dialog-close-trigger"
        >
          <div class="dialog-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" /></svg>
          </div>
        </button>
        <input
          placeholder="Enter name..."
          class="dialog-input"
        >
        <button>
          Save Changes
        </button>
      </div>
    </div>
  </div>

  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
