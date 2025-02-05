<script setup lang="ts">
import * as colorPicker from "@destyler/color-picker";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed,useId } from "vue";

const [state, send] = useMachine(colorPicker.machine({
  id: useId(),
  value: colorPicker.parse("hsl(0, 100%, 50%)")
}))

const api = computed(() => colorPicker.connect(state.value, send, normalizeProps));
</script>

<template>
  <div v-bind="api.getRootProps()">
    <label v-bind="api.getLabelProps()">Select Color: {{ api.valueAsString }}</label>
    <input v-bind="api.getHiddenInputProps()" />
    <div v-bind="api.getControlProps()">
      <button v-bind="api.getTriggerProps()" class="w-100px h-100px">
        <div v-bind="api.getTransparencyGridProps({ size: '10px' })" />
        <div v-bind="api.getSwatchProps({ value: api.value })" class="w-90px h-90px" />
      </button>
      <input v-bind="api.getChannelInputProps({ channel: 'hex' })" />
      <input v-bind="api.getChannelInputProps({ channel: 'alpha' })" />
    </div>

    <div v-bind="api.getPositionerProps()">
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
          <div v-bind="api.getTransparencyGridProps({ size: '12px' })" />
          <div v-bind="api.getChannelSliderTrackProps({ channel: 'alpha' })" />
          <div v-bind="api.getChannelSliderThumbProps({ channel: 'alpha' })" />
        </div>
      </div>
    </div>
  </div>
</template>
