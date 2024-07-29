<script setup lang="ts">
import { ref } from 'vue'
import { ProgressIndicator, ProgressRoot } from '../src'

const interactive = ref(0)
setTimeout(() => {
  // For some reason, this interval triggers twice in the same tick
  interactive.value = (interactive.value + 50) % 100
}, 200)
</script>

<template>
  <ProgressRoot
    v-model="interactive"
  >
    <ProgressIndicator
      :style="`transform: translateX(-${100 - interactive}%)`"
    />
    <div>
      {{ interactive.toFixed(2) }}%
    </div>
  </ProgressRoot>
</template>
