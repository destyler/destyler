<script setup lang="ts">
import * as slider from '@destyler/slider'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './index.css'

const [state, send] = useMachine(slider.machine({ id: useId(), value: [60] }))
const api = computed(() => slider.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()" class="slider-root">
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
        <input v-bind="api.getHiddenInputProps({ index })">
      </div>
    </div>
  </div>
</template>
