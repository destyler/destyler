<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { CheckboxIndicator, CheckboxRoot } from '@destyler/checkbox'
import { Label } from '@destyler/label'
</script>

<template>
  <div class="flex gap-2.5">
    <CheckboxRoot class="peer h-4 w-4 shrink-0 rounded-sm border border-px border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground">
      <CheckboxIndicator class="flex items-center justify-center text-current">
        <Icon name="carbon:checkmark" class="w-4 h-4" />
      </CheckboxIndicator>
    </CheckboxRoot>
    <Label class="text-sm text-black dark:text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:op-70">
      Accept terms and conditions
    </Label>
  </div>
</template>
