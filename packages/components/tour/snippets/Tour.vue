<script setup lang="ts">
import * as tour from '@destyler/tour'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './style.css'

const [state, send] = useMachine(tour.machine({
  id: useId(),
  steps: [
    {
      type: 'dialog',
      id: 'step-0',
      title: 'Starting Point',
      description: 'Click the start button to begin the tour.',
      actions: [{ label: 'Next', action: 'next' }],
    },
    {
      type: 'tooltip',
      id: 'step-1',
      title: 'Welcome',
      description: 'this is the first step of the tour.',
      target: () => document.querySelector<HTMLElement>('#_top'),
      actions: [
        { label: 'Prev', action: 'prev' },
        { label: 'Next', action: 'next' },
      ],
    },
    {
      type: 'tooltip',
      id: 'step-2',
      title: 'What is a tour?',
      description: 'A tour is a series of steps that guide users through your app.',
      target: () => document.querySelector<HTMLElement>('#what-is-a-tour'),
      actions: [
        { label: 'Prev', action: 'prev' },
        { label: 'Next', action: 'next' },
      ],
    },
    {
      type: 'dialog',
      id: 'step-3',
      title: 'Amazing! You got to the end',
      description: 'Like what you see? Now go ahead and use it in your project.',
      actions: [{ label: 'Finish', action: 'dismiss' }],
    },
  ],
}))

const api = computed(() => tour.connect(state.value, send, normalizeProps))
const open = computed(() => api.value.open && api.value.step)

function start() {
  api.value.start()
}
</script>

<template>
  <button id="start" class="btn" @click="start">
    Start Tour
  </button>
  <Teleport v-if="open" to="body">
    <div data-layout="sinppets">
      <div v-if="api.step?.backdrop" v-bind="api.getBackdropProps()" />
      <div v-bind="api.getSpotlightProps()" />
      <div v-bind="api.getPositionerProps()">
        <div v-bind="api.getContentProps()">
          <div v-if="api.step?.arrow" v-bind="api.getArrowProps()">
            <div v-bind="api.getArrowTipProps()" />
          </div>

          <p v-bind="api.getTitleProps()">
            {{ api.step?.title }}
          </p>
          <div v-bind="api.getDescriptionProps()">
            {{ api.step?.description }}
          </div>
          <div v-bind="api.getProgressTextProps()">
            {{ api.getProgressText() }}
          </div>

          <div v-if="api.step?.actions" class="flex justify-end gap-2">
            <button
              v-for="action in api.step?.actions"
              :key="action.label"
              v-bind="api.getActionTriggerProps({ action })"
            >
              {{ action.label }}
            </button>
          </div>

          <button v-bind="api.getCloseTriggerProps()">
            <div class="i-ph:x-bold" />
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
