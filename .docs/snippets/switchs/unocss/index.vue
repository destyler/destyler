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
  <div
    flex="~"
    items="center"
    space="x-2"
  >
    <SwitchRoot
      v-model:checked="value"
      inline="flex"
      h="6"
      w="11"
      shrink="0"
      cursor="pointer disabled:not-allowed"
      items="center"
      rounded="full"
      border="2 transparent"
      transition="colors"
      focus-visible="outline-none ring-2 ring-ring ring-offset-2 ring-offset-background"
      op="disabled:50"
      bg="data-[state=checked]:primary data-[state=unchecked]:input"
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
