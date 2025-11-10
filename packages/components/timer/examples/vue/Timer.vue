<script setup lang="ts">
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed } from 'vue'
import * as timer from '../../index'
import '../style.css'

const [state, send] = useMachine(
  timer.machine({
    id: 'v1',
    countdown: true,
    autoStart: true,
    startMs: timer.parse({ days: 2, seconds: 10 }),
    onComplete() {
      // eslint-disable-next-line no-console
      console.log('Timer completed')
    },
  }),
)

const api = computed(() => timer.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main class="timer">
      <div v-bind="api.getRootProps()">
        <div v-bind="api.getAreaProps()">
          <div v-bind="api.getItemProps({ type: 'days' })">
            {{ api.formattedTime.days }}
          </div>
          <div v-bind="api.getSeparatorProps()">
            :
          </div>
          <div v-bind="api.getItemProps({ type: 'hours' })">
            {{ api.formattedTime.hours }}
          </div>
          <div v-bind="api.getSeparatorProps()">
            :
          </div>
          <div v-bind="api.getItemProps({ type: 'minutes' })">
            {{ api.formattedTime.minutes }}
          </div>
          <div v-bind="api.getSeparatorProps()">
            :
          </div>
          <div v-bind="api.getItemProps({ type: 'seconds' })">
            {{ api.formattedTime.seconds }}
          </div>
        </div>
        <div v-bind="api.getControlProps()">
          <button v-bind="api.getActionTriggerProps({ action: 'start' })">
            START
          </button>
          <button v-bind="api.getActionTriggerProps({ action: 'pause' })">
            PAUSE
          </button>
          <button v-bind="api.getActionTriggerProps({ action: 'resume' })">
            RESUME
          </button>
          <button v-bind="api.getActionTriggerProps({ action: 'reset' })">
            RESET
          </button>
        </div>
      </div>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" />
    </Toolbar>
  </Layout>
</template>
