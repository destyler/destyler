<script setup lang="ts">
import * as toggle from '@destyler/toggle'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '../../styles/components/toggle.css'

const [state, send] = useMachine(toggle.machine({
  id: useId(),
  multiple: true,
  value: ['bold'],
}))
const api = computed(() => toggle.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="flex items-center justify-center mt-0!">
    <div
      v-bind="api.getRootProps()"
    >
      <button
        v-for="(item, index) in ['bold', 'italic', 'underline']"
        :key="index"
        v-bind="api.getItemProps({ value: item })"
      >
        {{ item[0].toUpperCase() }}
      </button>
    </div>
  </div>
</template>
