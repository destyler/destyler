<script setup lang="ts">
import { sliderControls } from '@destyler/shared-private'
import * as slider from '@destyler/slider'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'
import { useControls } from '../composables/useControls'

const controls = useControls(sliderControls)

const [state, send] = useMachine(slider.machine({ id: useId(), value: [12] }), {
  context: controls.context,
})
const api = computed(() => slider.connect(state.value, send, normalizeProps))
</script>

<template>
  <div ref="ref" v-bind="api.getRootProps()" class="max-w-md mx-auto p-6">
    <div class="mb-4 flex justify-between items-center">
      <label v-bind="api.getLabelProps()" class="text-gray-700 font-medium">
        Slider Value
      </label>
      <output v-bind="api.getValueTextProps()" class="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
        {{ api.value.at(0) }}
      </output>
    </div>
    <div v-bind="api.getControlProps()" class="relative py-4">
      <div
        v-bind="api.getTrackProps()"
        class="w-full h-2 bg-gray-200 rounded-full"
      >
        <div
          v-bind="api.getRangeProps()"
          class="h-2 bg-gray-600 rounded-full"
        />
      </div>
      <div
        v-for="(_, index) in api.value"
        :key="index"
        v-bind="api.getThumbProps({ index })"
        class="absolute top-2.5 w-5 h-5 bg-white border-2 border-gray-600 rounded-full cursor-pointer transform -translate-y-1/2 hover:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <input v-bind="api.getHiddenInputProps({ index })">
      </div>
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
