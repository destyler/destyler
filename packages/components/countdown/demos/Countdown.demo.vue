<script setup lang="ts">
import { ref } from 'vue'
import { DestylerCountdown } from '../src'

const countdownRef = ref(null)

function handleReset() {
  countdownRef.value?.reset()
}
</script>

<template>
  <DestylerCountdown ref="countdownRef" :duration="5000" />
  <button @click="handleReset">
    Reset
  </button>
</template>
