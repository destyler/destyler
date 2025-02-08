<script setup lang="ts">
import * as dialog from '@destyler/dialog'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(dialog.machine({
  id: useId(),
  preventScroll: true,
  closeOnEscape: true,
  closeOnInteractOutside: false,
  role: 'dialog',
}))
const api = computed(() => dialog.connect(state.value, send, normalizeProps))
</script>

<template>
  <button
    v-bind="api.getTriggerProps()"
    class="px-4 py-2 bg-dark text-white rounded-md hover:bg-black transition-colors"
  >
    Open Dialog
  </button>
  <div>
    <div
      v-bind="api.getBackdropProps()"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm"
    />
    <div
      v-bind="api.getPositionerProps()"
      class="fixed inset-0 flex items-center justify-center"
    >
      <div
        v-bind="api.getContentProps()"
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative border border-gray-200"
      >
        <h2
          v-bind="api.getTitleProps()"
          class="text-xl font-semibold text-black mb-4"
        >
          Edit profile
        </h2>
        <p
          v-bind="api.getDescriptionProps()"
          class="text-gray-500 mb-6"
        >
          Make changes to your profile here. Click save when you are done.
        </p>
        <button
          v-bind="api.getCloseTriggerProps()"
          class="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <div class="w-4 h-4 i-carbon:close-large" />
        </button>
        <input
          placeholder="Enter name..."
          class="w-full px-3 py-2 border border-gray-200 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black"
        >
        <button class="w-full px-4 py-2 bg-dark text-white rounded-md hover:bg-black transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  </div>

  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <!-- <Controls :control="controls" /> -->
    </template>
  </Toolbar>
</template>
