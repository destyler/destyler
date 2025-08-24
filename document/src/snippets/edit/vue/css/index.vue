<script setup lang="ts">
import * as edit from "@destyler/edit";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed, useId } from "vue";
import './index.css';

const [state, send] = useMachine(edit.machine({
  id: useId(),
  placeholder: 'Type something...',
}));
const api = computed(() => edit.connect(state.value, send, normalizeProps));
</script>

<template>
  <div
    ref="ref"
    v-bind="api.getRootProps()"
    class="edit-root"
  >
    <div v-bind="api.getAreaProps()" class="edit-area">
      <input
        v-bind="api.getInputProps()"
        class="edit-input"
      />
      <span
        v-bind="api.getPreviewProps()"
        class="edit-preview"
      />
    </div>
    <div class="edit-actions">
      <template v-if="api.editing">
        <button
          v-bind="api.getSubmitTriggerProps()"
          class="edit-button-primary"
        >
          Save
        </button>
        <button
          v-bind="api.getCancelTriggerProps()"
          class="edit-button-secondary"
        >
          Cancel
        </button>
      </template>
      <button
        v-else
        v-bind="api.getEditTriggerProps()"
        class="edit-button-primary"
      >
        Edit
      </button>
    </div>
  </div>
</template>
