<script setup lang="ts">
  import * as fileUpload from "@destyler/file-upload"
  import { normalizeProps, useMachine } from "@destyler/vue"
  import { computed,useId } from "vue"

  const [state, send] = useMachine(fileUpload.machine({ id: useId() }))

  const api = computed(() =>
    fileUpload.connect(state.value, send, normalizeProps),
  )
</script>

<template>
  <div v-bind="api.getRootProps()" class="w-full min-w-md mx-auto">
    <div
      v-bind="api.getDropzoneProps()"
      class="mt-0! flex flex-col items-center justify-center border border-dashed 
      border-border rounded-md p-8 transition-colors cursor-pointer bg-background 
      hover:border-primary/50 data-[dragging]:bg-popover/50"
    >
      <input v-bind="api.getHiddenInputProps()" />
      <div class="flex flex-col items-center text-center mt-0!">
        <div class="mb-3 rounded-full p-2 mt-0!">
          <div class="i-lucide-upload w-6 h-6 text-primary mt-0!"></div>
        </div>
        <p class="text-sm font-medium text-accent-foreground mt-0!">Drag and drop files here</p>
        <p class="text-xs text-accent-foreground/50 mt-0!">or</p>
      </div>
      <button
        v-bind="api.getTriggerProps()"
        class="mt-2! text-sm font-medium h-9 px-4 py-2 bg-primary
        text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Choose Files
      </button>
    </div>

    <ul
      v-bind="api.getItemGroupProps()"
      class="mt-4! ml-0!"
    >
      <li
        v-for="file in api.acceptedFiles"
        :key="file.name"
        v-bind="api.getItemProps({ file })"
        class="mt-0! flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm"
      >
        <div class="flex items-center space-x-3">
          <div class="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
            <div class="i-lucide-file-text w-4 h-4 text-zinc-500 dark:text-zinc-400"></div>
          </div>
          <div
            v-bind="api.getItemNameProps({ file })"
            class="mt-0! text-sm text-zinc-900 dark:text-zinc-50 truncate max-w-[400px]"
          >
            {{ file.name }}
          </div>
        </div>
        <button
          v-bind="api.getItemDeleteTriggerProps({ file })"
          class="flex items-center justify-center w-6 h-6 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
        >
          <div class="i-lucide-x w-4 h-4"></div>
        </button>
      </li>
    </ul>
  </div>
</template>
