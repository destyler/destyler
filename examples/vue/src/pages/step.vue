<script setup lang="ts">
import { stepsControls } from '@destyler/shared-private'
import * as steps from '@destyler/steps'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useControls } from '../composables/useControls'

const controls = useControls(stepsControls)

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
  {
    context: controls.context,
  },
)

const api = computed(() => steps.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()" class="max-w-3xl mx-auto p-6 space-y-8">
    <div v-bind="api.getListProps()" class="flex items-center justify-between relative">
      <div
        v-for="(step, index) in stepsData"
        :key="index"
        v-bind="api.getItemProps({ index })"
        class="flex-1 relative"
      >
        <button
          v-bind="api.getTriggerProps({ index })"
          class="flex items-center space-x-2 group w-full"
        >
          <div
            v-bind="api.getIndicatorProps({ index })"
            class="w-8 h-8 rounded-full border-2 border-gray-300 flex
            bg-gray-50 data-[current]:bg-dark
            text-dark data-[current]:text-light
            items-center justify-center transition-colors
            group-hover:border-gray-600 group-focus:ring-2
            group-focus:ring-offset-2 group-focus:ring-gray-600
            data-[state=active]:bg-black data-[state=active]:text-white
            data-[state=complete]:bg-black data-[state=complete]:text-white"
          >
            {{ index + 1 }}
          </div>
          <span class="text-sm font-medium text-gray-700">{{ step.title }}</span>
        </button>
        <div
          v-bind="api.getSeparatorProps({ index })"
          class="absolute top-4 w-full left-0 -z-10 border-t-2 border-gray-200"
        />
      </div>
    </div>

    <div
      v-for="(step, index) in stepsData"
      :key="index"
      v-bind="api.getContentProps({ index })"
      class="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      {{ step.title }}
    </div>

    <div
      v-bind="api.getContentProps({ index: stepsData.length })"
      class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center text-gray-700"
    >
      Steps Complete - Thank you for filling out the form!
    </div>

    <div class="flex justify-between pt-4">
      <button
        v-bind="api.getPrevTriggerProps()"
        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
      >
        Back
      </button>
      <button
        v-bind="api.getNextTriggerProps()"
        class="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
      >
        Next
      </button>
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
