<script setup lang="ts">
import '@destyler/shared-private/styles/slider.css'
import { sliderControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import * as slider from '@destyler/slider'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'

const controls = useControls(sliderControls)

const [state, send] = useMachine(slider.machine({ id: useId(), value: [12] }), {
  context: controls.context,
})
const api = computed(() => slider.connect(state.value, send, normalizeProps))
</script>

<template>
  <div ref="ref" v-bind="api.getRootProps()" class="slider-root">
    <div class="slider-header">
      <label v-bind="api.getLabelProps()" class="slider-label">
        Slider Value
      </label>
      <output v-bind="api.getValueTextProps()" class="slider-value-text">
        {{ api.value.at(0) }}
      </output>
    </div>
    <div v-bind="api.getControlProps()" class="slider-control">
      <div
        v-bind="api.getTrackProps()"
        class="slider-track"
      >
        <div
          v-bind="api.getRangeProps()"
          class="slider-range"
        />
      </div>
      <div
        v-for="(_, index) in api.value"
        :key="index"
        v-bind="api.getThumbProps({ index })"
        class="slider-thumb"
      >
        <input v-bind="api.getHiddenInputProps({ index })" class="slider-hidden-input">
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
