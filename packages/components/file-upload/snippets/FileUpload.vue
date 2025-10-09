<script setup lang="ts">
import * as fileUpload from '@destyler/file-upload'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './style.css'

const [state, send] = useMachine(fileUpload.machine({ id: useId() }))

const api = computed(() =>
  fileUpload.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div v-bind="api.getDropzoneProps()">
      <input v-bind="api.getHiddenInputProps()">
      <div class="flex flex-col items-center text-center mt-0!">
        <div class="mb-3 rounded-full p-2 mt-0!">
          <div class="i-lucide-upload w-6 h-6 text-primary mt-0!" />
        </div>
        <p class="text-sm font-medium text-accent-foreground mt-0!">
          Drag and drop files here
        </p>
        <p class="text-xs text-accent-foreground/50 mt-0!">
          or
        </p>
      </div>
      <button v-bind="api.getTriggerProps()">
        Choose Files
      </button>
    </div>

    <ul v-bind="api.getItemGroupProps()">
      <li
        v-for="file in api.acceptedFiles"
        :key="file.name"
        v-bind="api.getItemProps({ file })"
      >
        <div class="flex items-center space-x-3">
          <div class="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
            <div class="i-lucide-file-text w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          </div>
          <div v-bind="api.getItemNameProps({ file })">
            {{ file.name }}
          </div>
        </div>
        <button v-bind="api.getItemDeleteTriggerProps({ file })">
          <div />
        </button>
      </li>
    </ul>
  </div>
</template>
