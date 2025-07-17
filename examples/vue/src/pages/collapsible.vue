<script setup lang="ts">
import * as collapsible from '@destyler/collapsible'
import { collapsibleControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

import '@destyler/shared-private/styles/collapsible.css'

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
    class="collapsible-root"
    v-bind="api.getRootProps()"
  >
    <button
      class="group collapsible-trigger"
      v-bind="api.getTriggerProps()"
    >
      <span>Toggle Content</span>
      <div
        class="collapsible-trigger-icon"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z" /></svg>
      </div>
    </button>

    <div
      class="content"
      v-bind="api.getContentProps()"
    >
      <div class="p-4 leading-relaxed">
        <p class="desc">
          This is a collapsible demo content. You can place any content here that you want to show or hide.
        </p>
        <p class="desc">
          Click the button above to toggle the content state.
        </p>
      </div>
    </div>
  </div>

  <div>
    <div>Toggle Controls</div>
    <button class="button" @click="api.setOpen(true)">
      Open
    </button>
    <button class="button" @click="api.setOpen(false)">
      Close
    </button>
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
