<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { CheckboxIndicator, CheckboxRoot } from '@destyler/checkbox'
</script>

<template>
  <div
    flex="~"
    gap="2.5"
  >
    <CheckboxRoot
      class="peer"
      h="4"
      w="4"
      shrink="0"
      rounded="sm"
      border="~ primary"
      shadow="~"
      focus-visible="outline-none ring-1 ring-ring"
      cursor="disabled:not-allowed"
      op="disabled:50"
      bg="data-[state=checked]:primary"
      text="data-[state=checked]:primary-foreground"
    >
      <CheckboxIndicator
        flex="~"
        items="center"
        justify="center"
        text="current"
      >
        <Icon name="carbon:checkmark" class="w-4 h-4" />
      </CheckboxIndicator>
    </CheckboxRoot>
    <label
      text="sm black dark:white"
      font="medium"
      leading="none"
      peer-disabled="cursor-not-allowed opacity-70"
    >
      Accept terms and conditions
    </label>
  </div>
</template>
