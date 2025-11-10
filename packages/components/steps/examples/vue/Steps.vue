<script setup lang="ts">
import { stepsControls, stepsData } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed } from 'vue'
import * as steps from '../../index'
import '../style.css'

const controls = useControls(stepsControls)

const [state, send] = useMachine(
  steps.machine({
    id: '1',
    count: stepsData.length,
  }),
  {
    context: controls.context,
  },
)

const api = computed(() => steps.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <div v-bind="api.getRootProps()">
        <div v-bind="api.getListProps()">
          <div v-for="(step, index) in stepsData" :key="index" v-bind="api.getItemProps({ index })">
            <button v-bind="api.getTriggerProps({ index })">
              <div v-bind="api.getIndicatorProps({ index })">
                {{ index + 1 }}
              </div>
              <span>{{ step.title }}</span>
            </button>
            <div v-bind="api.getSeparatorProps({ index })" />
          </div>
        </div>

        <div v-for="(step, index) in stepsData" :key="index" v-bind="api.getContentProps({ index })">
          {{ step.title }} - {{ step.description }}
        </div>

        <div v-bind="api.getContentProps({ index: stepsData.length })">
          Steps Complete - Thank you for filling out the form!
        </div>

        <div>
          <button v-bind="api.getPrevTriggerProps()">
            Back
          </button>
          <button v-bind="api.getNextTriggerProps()">
            Next
          </button>
        </div>
      </div>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
