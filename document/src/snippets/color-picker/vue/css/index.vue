<script setup lang="ts">
import * as colorPicker from '@destyler/color-picker'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './index.css'

const [state, send] = useMachine(colorPicker.machine({
  id: useId(),
  value: colorPicker.parse('hsl(240,5.9%,10%)'),
}))

const api = computed(() => colorPicker.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()" class="color-picker-root">
    <input v-bind="api.getHiddenInputProps()" class="color-picker-hidden-input">
    <div v-bind="api.getControlProps()" class="color-picker-control">
      <button v-bind="api.getTriggerProps()" class="color-picker-trigger">
        <div v-bind="api.getTransparencyGridProps({ size: '8px' })" class="color-picker-transparency-grid" />
        <div v-bind="api.getSwatchProps({ value: api.value })" class="color-picker-swatch" />
      </button>
      <div class="color-picker-input-container">
        <input v-bind="api.getChannelInputProps({ channel: 'hex' })" class="color-picker-channel-input color-picker-channel-input-hex">
        <input v-bind="api.getChannelInputProps({ channel: 'alpha' })" class="color-picker-channel-input color-picker-channel-input-alpha">
      </div>
    </div>

    <Teleport v-if="api.open" to="body">
      <div v-bind="api.getPositionerProps()" class="color-picker-positioner">
        <div v-bind="api.getContentProps()" class="color-picker-content">
          <div v-bind="api.getAreaProps()" class="color-picker-area">
            <div v-bind="api.getAreaBackgroundProps()" class="color-picker-area-background" />
            <div v-bind="api.getAreaThumbProps()" class="color-picker-area-thumb" />
          </div>

          <div v-bind="api.getChannelSliderProps({ channel: 'hue' })" class="color-picker-channel-slider color-picker-channel-slider-hue">
            <div v-bind="api.getChannelSliderTrackProps({ channel: 'hue' })" class="color-picker-channel-slider-track" />
            <div v-bind="api.getChannelSliderThumbProps({ channel: 'hue' })" class="color-picker-channel-slider-thumb" />
          </div>

          <div v-bind="api.getChannelSliderProps({ channel: 'alpha' })" class="color-picker-channel-slider color-picker-channel-slider-alpha">
            <div v-bind="api.getTransparencyGridProps({ size: '8px' })" class="color-picker-transparency-grid" />
            <div v-bind="api.getChannelSliderTrackProps({ channel: 'alpha' })" class="color-picker-channel-slider-track" />
            <div v-bind="api.getChannelSliderThumbProps({ channel: 'alpha' })" class="color-picker-channel-slider-thumb" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
