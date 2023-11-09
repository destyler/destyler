<script setup lang="ts">
import type { CountdownInst } from '@destyler/components/countdown/src'
import { DestylerCountdown } from '@destyler/components/countdown/src'

const countdown = ref<CountdownInst | null>()

function handleReset() {
  countdown.value?.reset()
}
</script>

<template>
  <span>
    <DestylerCountdown ref="countdown" :duration="86400000" :active="true" />
  </span>
  <button @click="handleReset">
    重置
  </button>
</template>

<style>

</style>
