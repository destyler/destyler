<script setup lang="ts">
import { switchControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import * as switchs from '@destyler/switch'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/switch.css'

const controls = useControls(switchControls)

const [state, send] = useMachine(switchs.machine({ id: useId() }), {
  context: controls.context,
})

const api = computed(() =>
  switchs.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <h1 data-testid="click">
    Switch
  </h1>
  <label
    v-bind="api.getRootProps()"
    class="switch-root"
  >
    <input data-testid="input" v-bind="api.getHiddenInputProps()" class="switch-hidden-input">
    <span
      data-testid="control"
      v-bind="api.getControlProps()"
      class="switch-control"
    >
      <span
        v-bind="api.getThumbProps()"
        class="switch-thumb"
      />
    </span>
    <span
      data-testid="label"
      v-bind="api.getLabelProps()"
      class="switch-label"
    >
      <span>{{ api.checked ? 'open' : 'close' }}</span>
    </span>
  </label>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
