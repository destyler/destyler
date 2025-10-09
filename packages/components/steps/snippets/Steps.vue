<script setup lang="ts">
import * as steps from '@destyler/steps'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './style.css'

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
  <div v-bind="api.getRootProps()">
    <div v-bind="api.getListProps()">
      <div
        v-for="(step, index) in stepsData"
        :key="index"
        v-bind="api.getItemProps({ index })"
      >
        <button v-bind="api.getTriggerProps({ index })" class="group">
          <div v-bind="api.getIndicatorProps({ index })">
            {{ index + 1 }}
          </div>
          <span class="text-sm font-medium z-3! text-foreground">{{ step.title }}</span>
        </button>
        <div v-bind="api.getSeparatorProps({ index })" />
      </div>
    </div>

    <div
      v-for="(step, index) in stepsData"
      :key="index"
      v-bind="api.getContentProps({ index })"
    >
      {{ step.title }}
    </div>

    <div v-bind="api.getContentProps({ index: stepsData.length })">
      Steps Complete - Thank you for filling out the form!
    </div>

    <div class="flex justify-between pt-4 mt-0!">
      <button v-bind="api.getPrevTriggerProps()">
        Back
      </button>
      <button v-bind="api.getNextTriggerProps()">
        Next
      </button>
    </div>
  </div>
</template>
