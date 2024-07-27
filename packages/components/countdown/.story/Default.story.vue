<script setup lang="ts">
import { ref } from 'vue'
import { Countdown } from '../src'

const duration = ref(5000)

const countdownRef = ref(null)

function handleReset() {
  countdownRef.value?.reset()
}
</script>

<template>
  <Story title="Countdown/Default">
    <Variant title="default">
      <Countdown ref="countdownRef" class="dark:text-light text-dark" :duration="duration" />
      <button @click="handleReset">
        Reset
      </button>
    </Variant>
  </Story>
</template>
