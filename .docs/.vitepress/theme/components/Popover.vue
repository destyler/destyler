<script setup lang="ts">
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'destyler'
</script>

<template>
  <PopoverRoot :modal="false">
    <PopoverTrigger
      class="w-4 h-4"
    >
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        class="z-90 max-w-87.5 rounded-md bg-light border border-solid border-dark border-op-9 dark:bg-#0e0e0e dark:border dark:border-solid dark:border-white dark:border-op-9 p-4"
        :side-offset="5"
      >
        <div class="flex text-sm">
          <slot />
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
