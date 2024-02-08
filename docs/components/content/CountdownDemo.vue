<script setup lang="ts">
import { ref } from 'vue'
import { DestylerCountdown } from 'destyler'

const countdownRef = ref<any>(null)

function handleReset() {
  countdownRef.value?.reset()
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="cursor-pointer" @click="handleReset">
      <DestylerCountdown ref="countdownRef" :duration="50000" />
    </div>
  </div>
</template>
