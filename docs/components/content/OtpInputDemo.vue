<script setup lang="ts">
import { ref } from 'vue'
import { DestylerOtpInput, DestylerOtpInputRoot } from 'destyler'

const value = ref<string[]>([])
</script>

<template>
  <div>
    <DestylerOtpInputRoot
      id="pin-input"
      v-model="value"
      placeholder="○"
      class="flex gap-2 items-center mt-1"
    >
      <DestylerOtpInput
        v-for="(id, index) in 5"
        :key="id"
        :index="index"
        class="w-10 h-10 bg-white dark:bg-#09090B border border-#E4E4E7 dark:border-#27272A rounded text-center shadow-lg text-#09090B dark:text-#FAFAFA focus:outline focus:outline-2 focus:outline-offset-2 dark:focus:outline-#27272A focus:outline-#E4E4E7"
      />
    </DestylerOtpInputRoot>
  </div>
</template>
