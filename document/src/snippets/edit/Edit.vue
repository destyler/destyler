<script setup lang="ts">
import * as edit from "@destyler/edit";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed, useId } from "vue";

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
    class="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md p-6"
  >
    <div v-bind="api.getAreaProps()" class="mb-4">
      <input
        v-bind="api.getInputProps()"
        class="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <span
        v-bind="api.getPreviewProps()"
        class="block mt-2 text-muted-foreground text-sm"
      />
    </div>
    <div class="flex justify-end gap-2 mt-0!">
      <template v-if="api.editing">
        <button
          v-bind="api.getSubmitTriggerProps()"
          class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Save
        </button>
        <button
          v-bind="api.getCancelTriggerProps()"
          class="mt-0! inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Cancel
        </button>
      </template>
      <button
        v-else
        v-bind="api.getEditTriggerProps()"
        class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Edit
      </button>
    </div>
  </div>
</template>
