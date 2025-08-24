<script setup lang="ts">
import * as dialog from '@destyler/dialog'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './Dialog.css'
  
const [state, send] = useMachine(
  dialog.machine({ id: useId() })
)
const api = computed(() =>
  dialog.connect(state.value, send, normalizeProps)
)
</script>

<template>
  <button
    v-bind="api.getTriggerProps()"
    class="dialog-trigger"
  >
    Open Dialog
  </button>
  <Teleport v-if="api.open" to="body">
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
            <div class="i-carbon:close-large" />
          </button>
          <input
            placeholder="Enter name..."
            class="dialog-input"
          />
          <button class="dialog-action">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
