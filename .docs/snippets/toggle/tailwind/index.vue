<script setup lang="ts">
import { ref } from 'vue'
import { Toggle } from '@destyler/toggle'
import { Icon } from '@destyler/icon'

const value = ref(true)
</script>

<template>
  <Toggle
    v-model:pressed="value"
    class="
    inline-flex items-center justify-center rounded-md text-sm
    font-medium transition-colors hover:bg-muted hover:text-muted-foreground
    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
    disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent
    data-[state=on]:text-accent-foreground bg-transparent h-9 px-3
    "
  >
    <Icon
      name="carbon:text-font"
      class="text-dark dark:text-light h-6 w-6"
    />
  </Toggle>
</template>
