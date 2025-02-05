<script setup lang="ts">
import * as slider from "@destyler/slider";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed,useId } from "vue";

const [state, send] = useMachine(slider.machine({ id: useId(), value: [12, 33, 54] }));
const api = computed(() => slider.connect(state.value, send, normalizeProps));
</script>

<template>
  <div ref="ref" v-bind="api.getRootProps()">
    <div>
      <label v-bind="api.getLabelProps()">Slider Label</label>
      <output v-bind="api.getValueTextProps()">{{ api.value.at(0) }}</output>
      <output v-bind="api.getValueTextProps()">{{ api.value.at(1) }}</output>
      <output v-bind="api.getValueTextProps()">{{ api.value.at(2) }}</output>
    </div>
    <div v-bind="api.getControlProps()" class="">
      <div v-bind="api.getTrackProps()" class="w-full h-10px bg-green">
        <div v-bind="api.getRangeProps()" class="h-10px bg-yellow" />
      </div>
      <div
        class="w-10px h-10px bg-red"
        v-for="(_, index) in api.value"
        :key="index"
        v-bind="api.getThumbProps({ index })"
      >
        <input v-bind="api.getHiddenInputProps({ index })" />
      </div>
    </div>
  </div>
</template>
