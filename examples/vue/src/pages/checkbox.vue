<script setup lang="ts">
import * as checkbox from '@destyler/checkbox'
import { checkboxControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/checkbox.css'

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
    >
      <div v-if="api.checked" class="checkbox-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="m13 24l-9-9l1.414-1.414L13 21.171L26.586 7.586L28 9z" /></svg>
      </div>
    </div>
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
