<script setup lang="ts">
import * as splitter from '@destyler/splitter'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@docs/styles/components/splitter.css'

const [state, send] = useMachine(
  splitter.machine({
    id: useId(),
    size: [
      { id: 'a', size: 30, minSize: 15 },
      { id: 'b', size: 70, minSize: 0 },
    ],
  }),
)

const api = computed(() => splitter.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div v-bind="api.getPanelProps({ id: 'a' })" class="bg-muted/50">
      <div class="text-center p-12 whitespace-nowrap ">
        <p class="text-card-foreground font-semibold text-2xl mb-2">
          One
        </p>
      </div>
    </div>
    <div v-bind="api.getResizeTriggerProps({ id: 'a:b' })" class="group">
      <div />
      <div />
    </div>
    <div v-bind="api.getPanelProps({ id: 'b' })" class="bg-card ">
      <div class="text-center p-12 whitespace-nowrap ">
        <p class="text-card-foreground font-semibold text-2xl mb-2">
          Two
        </p>
      </div>
    </div>
  </div>
</template>
