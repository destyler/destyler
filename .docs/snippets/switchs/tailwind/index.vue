<script setup lang="ts">
import { ref } from 'vue'
import {
  SwitchRoot,
  SwitchThumb,
} from '@destyler/switch'
import { Label } from '@destyler/label'

const value = ref(true)
</script>

<template>
  <div class="flex items-center space-x-2">
    <SwitchRoot
      v-model:checked="value"
      class="
      peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center
      rounded-full border-2 border-transparent transition-colors
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
      focus-visible:ring-offset-2 focus-visible:ring-offset-background
      disabled:cursor-not-allowed disabled:opacity-50
      data-[state=checked]:bg-primary data-[state=unchecked]:bg-input
      "
    >
      <SwitchThumb
        class="
        pointer-events-none block h-5 w-5 rounded-full bg-background
        shadow-lg ring-0 transition-transform
        data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0
        "
      />
    </SwitchRoot>
    <Label class="text-sm text-black dark:text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:op-70">
      Airplane Mode
    </Label>
  </div>
</template>
