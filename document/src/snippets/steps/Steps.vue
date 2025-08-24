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
  <div v-bind="api.getRootProps()" class="w-70%">
    <div v-bind="api.getListProps()" class="relative flex items-center justify-between">
      <div
        v-for="(step, index) in stepsData"
        :key="index"
        v-bind="api.getItemProps({ index })"
        class="relative flex-1 mt-0!"
      >
        <button
          v-bind="api.getTriggerProps({ index })"
          class="flex w-full items-center gap-2 z-4! group"
        >
          <div
            v-bind="api.getIndicatorProps({ index })"
            class="flex h-8 w-8 items-center justify-center rounded-full border-2
            bg-background text-foreground z-2!
            border-border transition-colors
            data-[current]:bg-primary data-[current]:text-primary-foreground
            data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
            data-[state=complete]:bg-primary data-[state=complete]:text-primary-foreground
            group-hover:border-primary/50
            group-focus-visible:outline-none group-focus-visible:ring-2
            group-focus-visible:ring-ring group-focus-visible:ring-offset-2"
          >
            {{ index + 1 }}
          </div>
          <span class="text-sm font-medium z-3! text-foreground">{{ step.title }}</span>
        </button>
        <div
          v-bind="api.getSeparatorProps({ index })"
          class="absolute left-0 top-4 z-0 w-full border-t-2 border-border mt-0!"
        />
      </div>
    </div>

    <div
      v-for="(step, index) in stepsData"
      :key="index"
      v-bind="api.getContentProps({ index })"
      class="rounded-lg border border-border bg-card p-6 text-card-foreground mt-2! shadow-sm"
    >
      {{ step.title }}
    </div>

    <div
      v-bind="api.getContentProps({ index: stepsData.length })"
      class="rounded-lg border border-border bg-card p-6 text-center text-card-foreground shadow-sm"
    >
      Steps Complete - Thank you for filling out the form!
    </div>

    <div class="flex justify-between pt-4 mt-0!">
      <button
        v-bind="api.getPrevTriggerProps()"
        class="btn bg-secondary text-secondary-foreground hover:bg-secondary/90"
      >
        Back
      </button>
      <button
        v-bind="api.getNextTriggerProps()"
        class="btn mt-0!"
      >
        Next
      </button>
    </div>
  </div>
</template>
