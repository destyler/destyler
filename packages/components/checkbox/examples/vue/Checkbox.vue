<script setup lang="ts">
import { checkboxControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as checkbox from '../../index'
import '../style.css'

const controls = useControls(checkboxControls)

const [state, send] = useMachine(checkbox.machine({ id: useId() }), {
  context: controls.context,
})

const api = computed(() =>
  checkbox.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <main>main</main>
  <label v-bind="api.getRootProps()" class="checkbox-root">
    <div
      v-bind="api.getControlProps()"
      class="checkbox-control"
    />
    <span v-bind="api.getLabelProps()">
      Input is
      <span v-if="api.checked"> checked</span>
      <span v-else> unchecked</span>
    </span>

    <input data-testid="hidden-input" v-bind="api.getHiddenInputProps()">
  </label>

  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
