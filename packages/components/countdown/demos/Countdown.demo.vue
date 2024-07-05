<script setup lang="ts">
import { ref } from 'vue'
import { Countdown } from '../src'

const countdownRef = ref(null)

function handleReset() {
  countdownRef.value?.reset()
}
</script>

<template>
  <Countdown ref="countdownRef" :duration="5000" />
  <button @click="handleReset">
    Reset
  </button>
</template>
