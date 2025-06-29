<script setup lang="ts">
import { highlightState } from '@destyler/stringify'
import { defineProps, isRef } from 'vue'

const props = defineProps<{
  state: any
  label?: string
  omit?: string[]
}>()

const state = isRef(props.state) ? props.state.value : props.state
</script>

<template>
  <div class="viz">
    <pre>
        <details open>
          <summary> {{ props.label || "Visualizer" }} </summary>
          <div v-html="highlightState(state, props.omit)" />
        </details>
      </pre>
  </div>
</template>
