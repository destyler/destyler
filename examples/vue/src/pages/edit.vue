<script setup lang="ts">
import * as edit from "@destyler/edit";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed, useId } from "vue";
import { editControls } from '@destyler/shared-private'
import { useControls } from '../composables/useControls'

const controls = useControls(editControls)

const [state, send] = useMachine(edit.machine({
  id: useId(),
  placeholder: 'Type something...',
}),{
  context: controls.context,
});
const api = computed(() => edit.connect(state.value, send, normalizeProps));
</script>

<template>
  <div ref="ref" v-bind="api.getRootProps()" class="max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-200">
    <div v-bind="api.getAreaProps()" class="mb-4">
      <input
        v-bind="api.getInputProps()"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
      />
      <span
        v-bind="api.getPreviewProps()"
        class="block mt-2 text-gray-700"
      />
    </div>
    <div class="flex justify-end space-x-2">
      <div v-if="api.editing" class="space-x-2">
        <button
          v-bind="api.getSubmitTriggerProps()"
          class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Save
        </button>
        <button
          v-bind="api.getCancelTriggerProps()"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
      <button
        v-else
        v-bind="api.getEditTriggerProps()"
        class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
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
