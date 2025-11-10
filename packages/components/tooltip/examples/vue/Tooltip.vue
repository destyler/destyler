<script setup>
import { Layout } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed } from 'vue'
import * as tooltip from '../../index'
import '../style.css'

const [state, send] = useMachine(
  tooltip.machine({
    id: '1',
    positioning: {
      sameWidth: true,
    },
    closeDelay: 60000,
  }),
)
const api = computed(() => tooltip.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <div style="padding: 40px">
      <pre>{{ state.value }}</pre>
      <button v-bind="api.getTriggerProps()">
        Hover me
      </button>
      <Teleport to="body">
        <div v-if="api.open" v-bind="api.getPositionerProps()">
          <div v-bind="api.getContentProps()">
            Tooltip with a lot of text probably
          </div>
        </div>
      </Teleport>
    </div>
  </Layout>
</template>
