<script setup lang="ts">
import { ref } from 'vue'
import { DestylerOtpInput, DestylerOtpInputRoot } from '../src'

const value = ref<string[]>([])
const handleComplete = (e: string[]) => alert(e.join(''))
</script>

<template>
  <div>
    <label for="pin-input" class="text-white">Pin Input</label>
    <DestylerOtpInputRoot
      id="pin-input"
      v-model="value"
      placeholder="○"
      class="flex gap-2 items-center mt-1"
      @complete="handleComplete"
    >
      <DestylerOtpInput
        v-for="(id, index) in 5"
        :key="id"
        :index="index"
        class="w-10 h-10 bg-white rounded text-center shadow-lg text-#33B074 placeholder:text-#625F69 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white"
      />
    </DestylerOtpInputRoot>
  </div>
</template>
