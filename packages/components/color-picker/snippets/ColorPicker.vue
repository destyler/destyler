<script setup lang="ts">
import * as colorPicker from '@destyler/color-picker'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './style.css'

const [state, send] = useMachine(colorPicker.machine({
  id: useId(),
  value: colorPicker.parse('hsl(240,5.9%,10%)'),
}))

const api = computed(() => colorPicker.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()">
    <input v-bind="api.getHiddenInputProps()">
    <div v-bind="api.getControlProps()">
      <button v-bind="api.getTriggerProps()">
        <div v-bind="api.getTransparencyGridProps({ size: '8px' })" />
        <div v-bind="api.getSwatchProps({ value: api.value })" />
      </button>
      <div class="flex flex-col gap-1.5 mt-0!">
        <input v-bind="api.getChannelInputProps({ channel: 'hex' })">
        <input v-bind="api.getChannelInputProps({ channel: 'alpha' })">
      </div>
    </div>

    <Teleport v-if="api.open" to="body">
      <div data-layout="sinppets" v-bind="api.getPositionerProps()">
        <div v-bind="api.getContentProps()">
          <div v-bind="api.getAreaProps()">
            <div v-bind="api.getAreaBackgroundProps()" />
            <div v-bind="api.getAreaThumbProps()" />
          </div>

          <div v-bind="api.getChannelSliderProps({ channel: 'hue' })">
            <div v-bind="api.getChannelSliderTrackProps({ channel: 'hue' })" />
            <div v-bind="api.getChannelSliderThumbProps({ channel: 'hue' })" />
          </div>

          <div v-bind="api.getChannelSliderProps({ channel: 'alpha' })">
            <div v-bind="api.getTransparencyGridProps({ size: '8px' })" />
            <div v-bind="api.getChannelSliderTrackProps({ channel: 'alpha' })" />
            <div v-bind="api.getChannelSliderThumbProps({ channel: 'alpha' })" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
