<script setup lang="ts">
import * as colorPicker from '@destyler/color-picker'
import { colorPickerControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/color-picker.css'

const controls = useControls(colorPickerControls)

const [state, send] = useMachine(colorPicker.machine({
  id: useId(),
  name: 'color',
  format: 'hsla',
  value: colorPicker.parse('hsl(0, 100%, 50%)'),
}), {
  context: controls.context,
})

const api = computed(() => colorPicker.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()" class="color-picker-root">
    <label v-bind="api.getLabelProps()" class="color-picker-label">
      Select Color: <span data-testid="value-text">{{ api.valueAsString }}</span>
    </label>
    <input v-bind="api.getHiddenInputProps()">
    <div v-bind="api.getControlProps()" class="color-picker-control">
      <button v-bind="api.getTriggerProps()" class="color-picker-trigger">
        <div v-bind="api.getTransparencyGridProps({ size: '10px' })" class="color-picker-transparency-grid" />
        <div v-bind="api.getSwatchProps({ value: api.value })" class="color-picker-swatch" />
      </button>
      <div class="color-picker-input-box">
        <input
          v-bind="api.getChannelInputProps({ channel: 'hex' })"
          class="color-picker-channel-input"
        >
        <input
          v-bind="api.getChannelInputProps({ channel: 'alpha' })"
          class="color-picker-channel-input"
        >
      </div>
    </div>

    <div v-bind="api.getPositionerProps()" class="color-picker-positioner">
      <div v-bind="api.getContentProps()" class="color-picker-content">
        <div v-bind="api.getAreaProps()" class="color-picker-area">
          <div v-bind="api.getAreaBackgroundProps()" class="color-picker-area-background" />
          <div v-bind="api.getAreaThumbProps()" class="color-picker-area-thumb" />
        </div>

        <div v-bind="api.getChannelSliderProps({ channel: 'hue' })" class="color-picker-hue-slider">
          <div v-bind="api.getChannelSliderTrackProps({ channel: 'hue' })" class="color-picker-hue-slider-track" />
          <div v-bind="api.getChannelSliderThumbProps({ channel: 'hue' })" class="color-picker-hue-slider-thumb" />
        </div>

        <div v-bind="api.getChannelSliderProps({ channel: 'alpha' })" class="color-picker-alpha-slider">
          <div v-bind="api.getTransparencyGridProps({ size: '12px' })" class="color-picker-alpha-grid" />
          <div v-bind="api.getChannelSliderTrackProps({ channel: 'alpha' })" class="color-picker-alpha-slider-track" />
          <div v-bind="api.getChannelSliderThumbProps({ channel: 'alpha' })" class="color-picker-alpha-slider-thumb" />
        </div>
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
