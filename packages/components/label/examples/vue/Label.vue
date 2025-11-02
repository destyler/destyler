<script setup lang="ts">
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as label from '../../index'

const [state, send] = useMachine(label.machine({ id: useId() }))

const api = computed(() => label.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <label v-bind="api.getRootProps()">
      text
    </label>
    <Toolbar>
      <StateVisualizer :state="state" />
    </Toolbar>
  </Layout>
</template>
