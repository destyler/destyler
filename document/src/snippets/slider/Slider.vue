<script setup lang="ts">
import * as slider from '@destyler/slider'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '../../styles/components/slider.css'

const [state, send] = useMachine(slider.machine({ id: useId(), value: [60] }))
const api = computed(() => slider.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div v-bind="api.getControlProps()">
      <div v-bind="api.getTrackProps()">
        <div v-bind="api.getRangeProps()" />
      </div>
      <div
        v-for="(_, index) in api.value"
        :key="index"
        v-bind="api.getThumbProps({ index })"
      >
        <input v-bind="api.getHiddenInputProps({ index })">
      </div>
    </div>
  </div>
</template>
