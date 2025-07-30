<script setup lang="ts">
import * as edit from '@destyler/edit'
import { editControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/edit.css'

const controls = useControls(editControls)

const [state, send] = useMachine(edit.machine({
  id: useId(),
  value: 'Hello World',
  placeholder: 'Type something...',
}), {
  context: controls.context,
})
const api = computed(() => edit.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()" class="edit-root">
    <div v-bind="api.getAreaProps()" class="edit-area">
      <input
        data-testid="input"
        v-bind="api.getInputProps()"
        class="edit-input"
      >
      <span
        data-testid="preview"
        v-bind="api.getPreviewProps()"
        class="edit-preview"
      />
    </div>
    <div class="edit-actions-box space-x-2">
      <div v-if="api.editing" class="space-x-2">
        <button
          data-testid="save:trigger"
          v-bind="api.getSubmitTriggerProps()"
        >
          Save
        </button>
        <button
          data-testid="cancel:trigger"
          v-bind="api.getCancelTriggerProps()"
        >
          Cancel
        </button>
      </div>
      <button
        v-else
        data-testid="edit:trigger"
        v-bind="api.getEditTriggerProps()"
      >
        Edit
      </button>
    </div>
  </div>

  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
