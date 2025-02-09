<script setup lang="ts">
import * as checkbox from '@destyler/checkbox'
import { checkboxControls } from '@destyler/shared'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useControls } from '../composables/useControls'

const controls = useControls(checkboxControls)

const [state, send] = useMachine(checkbox.machine({ id: useId() }), {
  context: controls.context,
})

const api = computed(() =>
  checkbox.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <label v-bind="api.getRootProps()" class="flex gap-2.5 justify-start items-center cursor-pointer">
    <div
      v-bind="api.getControlProps()"
      class="h-4 w-4 shrink-0 rounded-sm border border-dark
      shadow focus-visible:outline-none focus-visible:ring-1
      disabled:cursor-not-allowed disabled:opacity-50
      data-[state=checked]:bg-dark data-[state=checked]:text-light
      flex justify-center items-center
      "
    >
      <div v-if="api.checked" class="i-carbon:checkmark w-3 h-3 text-light" />
    </div>
    <span v-bind="api.getLabelProps()">
      Input is
      <span v-if="api.checked"> checked</span>
      <span v-else> unchecked</span>
    </span>

    <input v-bind="api.getHiddenInputProps()">
  </label>

  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
