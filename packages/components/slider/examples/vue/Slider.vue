<script setup lang="ts">
import { sliderControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as slider from '../../index'
import '../style.css'

const controls = useControls(sliderControls)

const [state, send] = useMachine(
  slider.machine({
    id: useId(),
    name: 'quantity',
    value: [0],
  }),
  { context: controls.context },
)

const api = computed(() => slider.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main class="slider">
      <form>
        <div v-bind="api.getRootProps()">
          <div>
            <label data-testid="label" v-bind="api.getLabelProps()"> Slider Label </label>
            <output data-testid="output" v-bind="api.getValueTextProps()"> {{ api.value.at(0) }} </output>
          </div>
          <div class="control-area">
            <div v-bind="api.getControlProps()">
              <div data-testid="track" v-bind="api.getTrackProps()">
                <div v-bind="api.getRangeProps()" />
              </div>
              <div v-for="(_, index) in api.value" :key="index" v-bind="api.getThumbProps({ index })">
                <input v-bind="api.getHiddenInputProps({ index })">
              </div>
            </div>
            <div v-bind="api.getMarkerGroupProps()">
              <span v-bind="api.getMarkerProps({ value: 10 })">*</span>
              <span v-bind="api.getMarkerProps({ value: 30 })">*</span>
              <span v-bind="api.getMarkerProps({ value: 90 })">*</span>
            </div>
          </div>
        </div>
      </form>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
