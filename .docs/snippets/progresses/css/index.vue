<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ProgressIndicator, ProgressRoot } from '@destyler/progress'
import './style.css'

const value = ref(10)

onMounted(() => {
  const timer = setTimeout(() => (value.value = 66), 500)
  return () => clearTimeout(timer)
})
</script>

<template>
  <ProgressRoot
    v-model="value"
    class="root"
  >
    <ProgressIndicator
      class="indicator"
      :style="`transform: translateX(-${100 - value}%)`"
    />
  </ProgressRoot>
</template>
