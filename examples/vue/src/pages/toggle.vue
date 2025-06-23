<script setup lang="ts">
import * as toggle from "@destyler/toggle"
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed,useId } from "vue";
import { toggleControls } from '@destyler/shared-private-private'
import { useControls } from '../composables/useControls'

const controls = useControls(toggleControls)

const [state, send] = useMachine(toggle.machine({ id: useId() }),{
  context: controls.context,
})
const api = computed(() => toggle.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="flex">
    <div
      v-bind="api.getRootProps()"
      class="bg-white p-2 rounded-lg shadow-md space-x-2"
    >
      <button
        v-for="(item, index) in ['bold', 'italic', 'underline']"
        :key="index"
        v-bind="api.getItemProps({ value: item })"
        class="w-10 h-10 rounded-md border border-gray-200 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 font-medium"
        :class="{'bg-gray-800 text-white hover:bg-gray-700': api.value.includes(item)}"
      >
        {{ item[0].toUpperCase() }}
      </button>
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
