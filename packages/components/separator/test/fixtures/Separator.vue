<script setup lang="ts">
import { StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as separator from '../../index'

const [state, send] = useMachine(separator.machine({
  id: useId(),
  orientation: 'horizontal',
}))
const api = computed(() =>
  separator.connect(state.value, send, normalizeProps),
)

const [verticalState, verticalSend] = useMachine(separator.machine({
  id: useId(),
  orientation: 'vertical',
}))
const verticalApi = computed(() =>
  separator.connect(verticalState.value, verticalSend, normalizeProps),
)
</script>

<template>
  <div>
    <div v-bind="api.getRootProps()" style="height: 1px; background: #e1e5e9; margin: 15px 0;" />
    <div
      v-bind="verticalApi.getRootProps()"
      data-testid="vertical-separator"
      style="width: 1px; height: 100px; background: #e1e5e9; margin: 15px;"
    />
  </div>

  <Toolbar>
    <StateVisualizer :state="state" />
  </Toolbar>
</template>
