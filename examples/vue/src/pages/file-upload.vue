<script setup lang="ts">
import * as fileUpload from '@destyler/file-upload'
import { fileUploadControls } from '@destyler/shared-private'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useControls } from '../composables/useControls'

const controls = useControls(fileUploadControls)

const [state, send] = useMachine(fileUpload.machine({ id: useId() }), {
  context: controls.context,
})

const api = computed(() =>
  fileUpload.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()" class="max-w-2xl p-6">
    <div
      v-bind="api.getDropzoneProps()"
      class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-800 transition-colors cursor-pointer bg-gray-50 data-[dragging]:bg-gray-100"
    >
      <input v-bind="api.getHiddenInputProps()">
      <p class="text-gray-600">
        Drag and drop your files here
      </p>
      <p class="text-sm text-gray-400 mt-2">
        or
      </p>
      <button
        v-bind="api.getTriggerProps()"
        class="mt-4 px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-black transition-colors"
      >
        Choose Files...
      </button>
    </div>

    <ul
      v-bind="api.getItemGroupProps()"
      class="mt-6 space-y-3"
    >
      <li
        v-for="file in api.acceptedFiles"
        :key="file.name"
        v-bind="api.getItemProps({ file })"
        class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div
          v-bind="api.getItemNameProps({ file })"
          class="text-gray-700 truncate"
        >
          {{ file.name }}
        </div>
        <button
          v-bind="api.getItemDeleteTriggerProps({ file })"
          class="ml-4 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
