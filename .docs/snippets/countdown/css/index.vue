<script setup lang="ts">
import { ref } from 'vue'
import { Countdown } from '@destyler/countdown'
import './style.css'

const countdownRef = ref<any>(null)

function handleReset() {
  countdownRef.value?.reset()
}
</script>

<template>
  <div class="box" @click="handleReset">
    <Countdown ref="countdownRef" :duration="50000" />
  </div>
</template>
