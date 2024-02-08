<script setup lang="ts">
import { DestylerIcon, DestylerToggle } from 'destyler'
</script>

<template>
  <DestylerToggle
    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#71717A dark:hover:text-#A1A1AA focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-#F4F4F5 dark:data-[state=on]:bg-#27272A data-[state=on]:text-#18181B dark:data-[state=on]:text-#FAFAFA bg-transparent h-9 px-3"
  >
    <DestylerIcon name="radix-icons:code" class="w-4 h-4" />
  </DestylerToggle>
</template>
