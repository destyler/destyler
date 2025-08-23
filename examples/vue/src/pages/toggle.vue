<script setup lang="ts">
import { toggleControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import * as toggle from '@destyler/toggle'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/toggle.css'

const controls = useControls(toggleControls)

const [state, send] = useMachine(toggle.machine({ id: useId() }), {
  context: controls.context,
})
const api = computed(() => toggle.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="flex">
    <div
      v-bind="api.getRootProps()"
      class="toggle-root"
    >
      <button
        v-for="(item, index) in ['bold', 'italic', 'underline']"
        :key="index"
        v-bind="api.getItemProps({ value: item })"
        class="toggle-control"
        :data-testid="`item-${item}`"
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
