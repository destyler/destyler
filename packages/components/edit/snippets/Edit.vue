<script setup lang="ts">
import * as edit from '@destyler/edit'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './style.css'

const [state, send] = useMachine(edit.machine({
  id: useId(),
  placeholder: 'Type something...',
}))
const api = computed(() => edit.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div v-bind="api.getAreaProps()">
      <input v-bind="api.getInputProps()">
      <span v-bind="api.getPreviewProps()" />
    </div>
    <div class="flex justify-end gap-2 mt-0!">
      <template v-if="api.editing">
        <button v-bind="api.getSubmitTriggerProps()">
          Save
        </button>
        <button v-bind="api.getCancelTriggerProps()">
          Cancel
        </button>
      </template>
      <button v-else v-bind="api.getEditTriggerProps()">
        Edit
      </button>
    </div>
  </div>
</template>
