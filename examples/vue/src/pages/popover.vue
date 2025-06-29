<script setup lang="ts">
import * as popover from '@destyler/popover'
import { popoverControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const controls = useControls(popoverControls)

const [state, send] = useMachine(popover.machine({ id: useId() }), {
  context: controls.context,
})
const api = computed(() => popover.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="mt-5">
    <button
      v-bind="api.getTriggerProps()"
      class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
    >
      Click me
    </button>

    <div v-bind="api.getPositionerProps()" class="z-50">
      <div
        v-bind="api.getContentProps()"
        class="bg-white shadow-lg rounded-lg border border-gray-200 w-64 p-4 mt-2"
      >
        <div
          v-bind="api.getTitleProps()"
          class="text-lg font-semibold text-gray-900 mb-2"
        >
          Presenters
        </div>

        <div
          v-bind="api.getDescriptionProps()"
          class="text-gray-600 mb-4"
        >
          Description
        </div>

        <button class="w-full mb-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          Action Button
        </button>

        <button
          v-bind="api.getCloseTriggerProps()"
          class="absolute top-5 right-3 text-gray-400 hover:text-gray-600 i-carbon:close-large"
        />
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
