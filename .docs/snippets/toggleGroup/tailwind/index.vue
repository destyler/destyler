<script setup lang="ts">
import { ref } from 'vue'
import { ToggleGroupItem, ToggleGroupRoot } from '@destyler/toggle'
import { Icon } from '@destyler/icon'

const value = ref<string[]>(['bold'])

const options = ref<{ value: string, icon: string }[]>([
  {
    value: 'bold',
    icon: 'radix-icons:font-bold',
  },
  {
    value: 'italic',
    icon: 'radix-icons:font-italic',
  },
  {
    value: 'line',
    icon: 'radix-icons:underline',
  },
])
</script>

<template>
  <ToggleGroupRoot
    v-model="value"
    class="flex items-center justify-center gap-1"
    type="multiple"
  >
    <ToggleGroupItem
      v-for="option in options" :key="option.value" :value="option.value"
      class="
      inline-flex items-center justify-center rounded-md text-sm font-medium
      transition-colors hover:bg-muted hover:text-muted-foreground
      focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
      disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent
      data-[state=on]:text-accent-foreground bg-transparent h-9 px-3
      "
    >
      <Icon :name="option.icon" class="h-4 w-4 text-dark dark:text-light" />
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
