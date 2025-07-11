<script setup lang="ts">
import { progressControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as progress from '../../index'

const controls = useControls(progressControls)

const [state, send] = useMachine(progress.machine({
  id: useId(),
  value: 25,
  max: 100,
  min: 0,
}), {
  context: controls.context,
})

const [indeterminateState, indeterminateSend] = useMachine(progress.machine({
  id: useId(),
  value: null,
  max: 100,
  min: 0,
}))

const api = computed(() =>
  progress.connect(state.value, send, normalizeProps),
)

const indeterminateApi = computed(() =>
  progress.connect(indeterminateState.value, indeterminateSend, normalizeProps),
)
</script>

<template>
  <div>
    <!-- Regular progress -->
    <div v-bind="api.getRootProps()" style="width: 300px;">
      <div v-bind="api.getLabelProps()">
        Progress Label
      </div>
      <div v-bind="api.getTrackProps()" style="height: 10px; background: #f0f0f0; border-radius: 5px;">
        <div v-bind="api.getRangeProps()" style="height: 100%; background: #007acc; border-radius: 5px;" />
      </div>
      <div v-bind="api.getValueTextProps()">
        {{ api.valueAsString }}
      </div>
    </div>

    <!-- Indeterminate progress -->
    <div
      v-bind="indeterminateApi.getTrackProps()"
      data-testid="indeterminate-progress"
      style="height: 10px; background: #f0f0f0; border-radius: 5px; margin-top: 20px;"
    >
      <div v-bind="indeterminateApi.getRangeProps()" style="height: 100%; background: #007acc; border-radius: 5px;" />
    </div>

    <!-- Control buttons -->
    <div style="margin-top: 20px;">
      <button data-testid="set-value" @click="api.setValue(50)">
        Set to 50
      </button>
      <button data-testid="set-max" @click="api.setToMax()">
        Set to Max
      </button>
      <button data-testid="set-min" @click="api.setToMin()">
        Set to Min
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
