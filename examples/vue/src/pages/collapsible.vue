<script setup lang="ts">
import * as collapsible from '@destyler/collapsible'
import { collapsibleControls } from '@destyler/shared'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

import { useControls } from '../composables/useControls'

const controls = useControls(collapsibleControls)

const [state, send] = useMachine(collapsible.machine({ id: useId() }), {
  context: controls.context,
})

const api = computed(() =>
  collapsible.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div
    class="max-w-md my-8 rounded-lg overflow-hidden shadow-md"
    v-bind="api.getRootProps()"
  >
    <button
      class="group w-full px-4 py-3 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
      v-bind="api.getTriggerProps()"
    >
      <span>Toggle Content</span>
      <div
        class="
        text-sm transition-transform duration-300 ease-in-out
        group-data-[state=open]:rotate-180 i-carbon:chevron-down
        "
      />
    </button>

    <div
      class="bg-white overflow-hidden content"
      v-bind="api.getContentProps()"
    >
      <div class="p-4 leading-relaxed">
        <p class="text-gray-700 my-2">
          This is a collapsible demo content. You can place any content here that you want to show or hide.
        </p>
        <p class="text-gray-700 my-2">
          Click the button above to toggle the content state.
        </p>
      </div>
    </div>
  </div>

  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>

<style scoped>
@keyframes slideDown {
  from {
    height: 0;
  }
  to {
    height: var(--destyler-height);
  }
}

@keyframes slideUp {
  from {
    height: var(--destyler-height);
  }
  to {
    height: 0;
  }
}

.content[data-state='open'] {
  animation: slideDown 250ms cubic-bezier(0.87, 0, 0.13, 1);
}
.content[data-state='closed'] {
  animation: slideUp 250ms cubic-bezier(0.87, 0, 0.13, 1);
}
</style>
