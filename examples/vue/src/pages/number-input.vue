<script setup lang="ts">
import * as numberInput from '@destyler/number-input'
import { numberInputControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const controls = useControls(numberInputControls)

const [state, send] = useMachine(numberInput.machine({ id: useId() }), {
  context: controls.context,
})
const api = computed(() =>
  numberInput.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div
    class="max-w-[300px] mx-auto my-5 p-4"
    v-bind="api.getRootProps()"
  >
    <label
      class="block mb-2 text-sm text-gray-700"
      v-bind="api.getLabelProps()"
    >
      Enter number
    </label>
    <div class="flex items-center gap-2">
      <button
        class="flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 active:bg-gray-200 transition-all duration-200"
        v-bind="api.getDecrementTriggerProps()"
      >
        <span class="text-xl font-bold">-</span>
      </button>
      <input
        class="w-full h-10 px-2 text-center text-gray-700 border border-gray-200 rounded-md outline-none transition-colors duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        v-bind="api.getInputProps()"
      >
      <button
        class="flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 active:bg-gray-200 transition-all duration-200"
        v-bind="api.getIncrementTriggerProps()"
      >
        <span class="text-xl font-bold">+</span>
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
