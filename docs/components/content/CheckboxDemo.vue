<script setup lang="ts">
import { DestylerCheckboxIndicator, DestylerCheckboxRoot, DestylerIcon } from 'destyler'
</script>

<template>
  <div class="flex items-center space-x-2">
    <DestylerCheckboxRoot
      class="peer h-4 w-4 shrink-0 rounded-sm border border-#18181B dark:border-#FAFAFA shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-#18181B dark:data-[state=checked]:bg-#FAFAFA data-[state=checked]:text-#FAFAFA dark:data-[state=checked]:text-#18181B"
    >
      <DestylerCheckboxIndicator class="flex items-center justify-center text-current">
        <DestylerIcon name="i-ri-check-line" class="w-4 h-4" />
      </DestylerCheckboxIndicator>
    </DestylerCheckboxRoot>
    <label
      htmlFor="terms"
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      Accept terms and conditions
    </label>
  </div>
</template>
