<script setup lang="ts">
import * as steps from '@destyler/steps'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const stepsData = [
  { title: 'Step 1' },
  { title: 'Step 2' },
  { title: 'Step 3' },
]

const [state, send] = useMachine(
  steps.machine({
    id: useId(),
    count: stepsData.length,
  }),
)

const api = computed(() => steps.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()" class="steps-container">
    <div v-bind="api.getListProps()" class="steps-list">
      <div
        v-for="(step, index) in stepsData"
        :key="index"
        v-bind="api.getItemProps({ index })"
        class="steps-item"
      >
        <button
          v-bind="api.getTriggerProps({ index })"
          class="steps-trigger"
        >
          <div
            v-bind="api.getIndicatorProps({ index })"
            class="steps-indicator"
          >
            {{ index + 1 }}
          </div>
          <span class="steps-title">{{ step.title }}</span>
        </button>
        <div
          v-bind="api.getSeparatorProps({ index })"
          class="steps-separator"
        />
      </div>
    </div>

    <div
      v-for="(step, index) in stepsData"
      :key="index"
      v-bind="api.getContentProps({ index })"
      class="steps-content"
    >
      {{ step.title }}
    </div>

    <div
      v-bind="api.getContentProps({ index: stepsData.length })"
      class="steps-content-complete"
    >
      Steps Complete - Thank you for filling out the form!
    </div>

    <div class="steps-navigation">
      <button
        v-bind="api.getPrevTriggerProps()"
        class="btn btn-secondary"
      >
        Back
      </button>
      <button
        v-bind="api.getNextTriggerProps()"
        class="btn btn-primary"
      >
        Next
      </button>
    </div>
  </div>
</template>
